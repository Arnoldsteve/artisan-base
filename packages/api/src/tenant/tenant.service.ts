import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantMemberRepository } from './repositories/tenant-member.repository';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly tenantRepo: TenantRepository,
    private readonly memberRepo: TenantMemberRepository,
  ) {}

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

    return this.tenantRepo.update(tenantId, {
      name: dto.name,
      settings: dto.settings as any,
      timezone: dto.timezone,
      baseCurrency: dto.currency,
    });
  }

  /**
   * Business Logic: Paginated staff listing using Repository methods.
   */
  async listStaffMembers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // We delegate the DB calls to the Member Repository
    const [items, total] = await Promise.all([
      this.memberRepo.listByTenant(skip, limit),
      this.memberRepo.countByTenant(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}