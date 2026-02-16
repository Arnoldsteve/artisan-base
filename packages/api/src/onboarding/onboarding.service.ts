import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserRepository } from '../user/repositories/user.repository';
import { TenantRepository } from '../tenant/repositories/tenant.repository';
import { TenantMemberRepository } from '../tenant/repositories/tenant-member.repository';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import * as bcrypt from 'bcrypt'; 

/**
 * SOLID Principle: Facade Pattern / Orchestrator
 * This service coordinates the complex multi-step process of 
 * creating a new store, a new user, and their ownership record.
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
   * The core onboarding flow. 
   * Handled in a transaction to ensure database integrity at scale.
   */
  async register(dto: RegisterTenantDto) {
    // 1. Validation Checks (Fail fast before opening a transaction)
    const emailExists = await this.userRepo.existsByEmail(dto.email);
    if (emailExists) throw new ConflictException('Email already registered');

    const subdomainExists = await this.tenantRepo.existsBySubdomain(dto.subdomain);
    if (subdomainExists) throw new ConflictException('Subdomain already taken');

    // 2. Prepare Sensitive Data
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    try {
      /**
       * TRANSACTION: All or Nothing
       * We use the standard prisma client here because during onboarding, 
       * the 'tenantId' context is not yet established.
       */
      return await this.prisma.$transaction(async (tx) => {
        // Step A: Create the Global User
        const user = await tx.user.create({
          data: {
            email: dto.email,
            hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });

        // Step B: Create the Tenant (Organization)
        // We set regional defaults (Kenya/Africa/Global) based on the input
        const tenant = await tx.tenant.create({
          data: {
            name: dto.name,
            subdomain: dto.subdomain,
            ownerId: user.id,
            baseCurrency: dto.currency || 'KES', // Defaulting to Kenya for your core market
            timezone: dto.timezone || 'Africa/Nairobi',
          },
        });

        // Step C: Create the Membership (Linkage)
        // Assigning the 'OWNER' role automatically
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
      // Log error for internal monitoring
      console.error('Onboarding Transaction Failed:', error);
      throw new InternalServerErrorException('Failed to complete onboarding');
    }
  }
}