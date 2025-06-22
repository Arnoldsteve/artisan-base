import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class StoreService {
  // 1. Inject both PrismaService and TenantService
  constructor(
    private prisma: PrismaService,
    private tenantService: TenantService,
  ) {}

  /**
   * Creates a new store record in the public schema and triggers
   * the creation of the dedicated tenant schema.
   * @param userId The ID of the user creating the store.
   * @param storeId The desired unique ID/subdomain for the store.
   * @param storeName The display name of the store.
   */
  async create(userId: string, storeId: string, storeName: string) {
    // 2. Check if the store ID (subdomain) is already taken
    const existingStore = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (existingStore) {
      throw new ConflictException('This store ID is already taken.');
    }

    // 3. Check if the user already owns a store (for now, we'll limit to one)
    const userHasStore = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (userHasStore) {
      throw new ConflictException('You already own a store.');
    }

    // 4. Create the store record in the public schema
    const newStore = await this.prisma.store.create({
      data: {
        id: storeId,
        name: storeName,
        ownerId: userId,
      },
    });

    // 5. Trigger the creation of the tenant schema and its tables
    //    This is where we delegate the complex work to our TenantService.
    await this.tenantService.createTenant(storeId);

    return newStore;
  }
}