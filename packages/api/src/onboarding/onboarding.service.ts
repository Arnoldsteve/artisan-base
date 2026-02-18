import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { TenantRepository } from '../tenant/repositories/tenant.repository';
import { TenantService } from '../tenant/tenant.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { CheckSubdomainDto } from '../tenant/dto/check-subdomain.dto';
import * as bcrypt from 'bcrypt';

/**
 * SOLID Principle: Facade Pattern
 * This service orchestrates the high-level onboarding flow.
 * It handles Scenario 1: Re-using existing identities for new stores.
 */
@Injectable()
export class OnboardingService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly tenantService: TenantService,
  ) {}

  /**
   * Public utility to check if a subdomain is available.
   */
  async checkSubdomainAvailability(dto: CheckSubdomainDto) {
    const exists = await this.tenantRepo.existsBySubdomain(dto.subdomain);
    return { available: !exists };
  }

  /**
   * Intelligent Registration logic.
   * Handles both brand-new users and existing users adding stores.
   */
  async register(dto: RegisterTenantDto) {
    // 1. Identify the user (Scenario 1 check)
    const existingUser = await this.userRepo.findByEmail(dto.email);
    let userId: string;

    if (existingUser) {
      // SECURITY: If email exists, we MUST verify the password before adding a store
      const isPasswordValid = await bcrypt.compare(dto.password, existingUser.hashedPassword);
      if (!isPasswordValid) {
        // We throw Unauthorized instead of Conflict to prevent email fishing 
        // while ensuring only the real owner can add stores to this account.
        throw new UnauthorizedException('Invalid credentials for this existing account');
      }
      userId = existingUser.id;
    } else {
      // 2. New User flow
      const hashedPassword = await bcrypt.hash(dto.password, 12);
      const newUser = await this.userRepo.create({
        email: dto.email,
        hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      });
      userId = newUser.id;
    }

    // 3. Provision the Store (Scenario 2 DRY reuse)
    // We delegate the transaction and membership logic to the TenantService
    try {
      const tenant = await this.tenantService.provisionStore(userId, {
        name: dto.name,
        subdomain: dto.subdomain,
        currency: dto.currency,
        timezone: dto.timezone,
      });

      return {
        userId,
        tenantId: tenant.id,
        subdomain: tenant.subdomain,
      };
    } catch (error) {
      // Handle potential race conditions where subdomain was taken in the last millisecond
      if (error.status === 409) throw error;
      throw new InternalServerErrorException('Failed to provision store');
    }
  }
}