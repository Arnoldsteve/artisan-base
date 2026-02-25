import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantMemberRepository } from './repositories/tenant-member.repository';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { TenantUserRole } from '@generated/prisma/client';
import { PageOptionsDto } from '@/common/pagination/dtos/page-options.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantRepo: TenantRepository,
    private readonly memberRepo: TenantMemberRepository,
  ) {}

  /**
   * SOLID Principle: Single Responsibility
   * This is the REUSABLE "provisioning" logic.
   * It ensures a Store and its Owner Membership are created together or not at all.
   */
  async provisionStore(userId: string, dto: CreateStoreDto) {
    // 1. Global uniqueness check for subdomain
    const exists = await this.tenantRepo.existsBySubdomain(dto.subdomain);
    if (exists) {
      throw new ConflictException('This subdomain is already taken');
    }

    // 2. Atomic Transaction (Platform Level)
    // We use the base 'this.prisma' because the tenant context is not yet established.
    return this.prisma.$transaction(async (tx) => {
      // Step A: Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.name,
          subdomain: dto.subdomain,
          ownerId: userId,
          status: 'ACTIVE',
          baseCurrency: dto.currency || 'KES',
          timezone: dto.timezone || 'Africa/Nairobi',
          settings: {},
        },
      });

      // Step B: Create Membership linkage
      await tx.tenantMember.create({
        data: {
          tenantId: tenant.id,
          userId: userId,
          role: TenantUserRole.OWNER,
          isActive: true,
        },
      });

      return tenant;
    });
  }

  /**
   * Business Logic: Get store profile via Repository.
   */
  async getStoreProfile(tenantId: string) {
    const store = await this.tenantRepo.findById(tenantId);
    if (!store || store.deletedAt) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  /**
   * Business Logic: Orchestrate store update.
   */
  async updateStore(tenantId: string, dto: UpdateTenantDto) {
    const store = await this.getStoreProfile(tenantId);
    if (store.status !== 'ACTIVE') {
      throw new ForbiddenException('Cannot update a non-active store');
    }
    return this.tenantRepo.update(tenantId, dto);
  }

  /**
   * Business Logic: Paginated staff listing.
   */
  async listStaffMembers(options: PageOptionsDto) {
    return this.memberRepo.listByTenant(options);
  }

   /**
   * PUBLIC RESOLUTION: Translates a URL slug into a real store profile.
   * This is the "Entry Point" for the storefront.
   */
  async resolveStoreBySlug(slug: string) {
    const store = await this.tenantRepo.findBySubdomain(slug);

    if (!store || store.status !== 'ACTIVE') {
      throw new NotFoundException(`Store with URL '${slug}' not found or is currently inactive.`);
    }

    // Enterprise Scale: This object provides the 'tenantId' to the frontend 
    // so it can start sending the x-tenant-id header.
    return store;
  }
}
