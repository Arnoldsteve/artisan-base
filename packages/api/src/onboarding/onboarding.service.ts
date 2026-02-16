import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserRepository } from '../user/repositories/user.repository';
import { TenantRepository } from '../tenant/repositories/tenant.repository';
import { TenantMemberRepository } from '../tenant/repositories/tenant-member.repository';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { CheckSubdomainDto } from '../tenant/dto/check-subdomain.dto';
import * as bcrypt from 'bcrypt'; 

/**
 * SOLID Principle: Facade Pattern / Orchestrator
 * Updated to include public utility checks for the onboarding flow.
 */
@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepo: UserRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly memberRepo: TenantMemberRepository,
  ) {}

  /**
   * Public utility to check if a subdomain is available.
   * Millions of Users: This allows the frontend to validate names instantly.
   */
  async checkSubdomainAvailability(dto: CheckSubdomainDto): Promise<{ available: boolean }> {
    const exists = await this.tenantRepo.existsBySubdomain(dto.subdomain);
    return { available: !exists };
  }

  /**
   * The core onboarding flow (remains unchanged but included for context).
   */
  async register(dto: RegisterTenantDto) {
    const emailExists = await this.userRepo.existsByEmail(dto.email);
    if (emailExists) throw new ConflictException('Email already registered');

    const subdomainExists = await this.tenantRepo.existsBySubdomain(dto.subdomain);
    if (subdomainExists) throw new ConflictException('Subdomain already taken');

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });

        const tenant = await tx.tenant.create({
          data: {
            name: dto.name,
            subdomain: dto.subdomain,
            ownerId: user.id,
            baseCurrency: dto.currency || 'KES',
            timezone: dto.timezone || 'Africa/Nairobi',
          },
        });

        await tx.tenantMember.create({
          data: {
            userId: user.id,
            tenantId: tenant.id,
            role: 'OWNER',
            isActive: true,
          },
        });

        return {
          userId: user.id,
          tenantId: tenant.id,
          subdomain: tenant.subdomain,
        };
      });
    } catch (error) {
      console.error('Onboarding Transaction Failed:', error);
      throw new InternalServerErrorException('Failed to complete onboarding');
    }
  }
}