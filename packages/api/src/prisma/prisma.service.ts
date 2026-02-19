import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { CacheHelperService } from '@/common/cache/cache-helper.service';
import { PrismaClient } from '@generated/prisma/client';
import { extendedPrismaClient, ExtendedPrismaClient } from './prisma-client.provider';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly _tenantPrisma: ExtendedPrismaClient;

  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly cacheHelper: CacheHelperService,
  ) {
    // 1. Setup Connection Pooling for Global Scale
    // This pool is shared across all tenant queries for maximum efficiency
    const poolConfig: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 30,                       // Support high concurrency
      idleTimeoutMillis: 30000,      
      connectionTimeoutMillis: 5000, 
      maxUses: 7500,                 // Prevent memory leaks in long-running processes
    };

    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);

    // 2. Initialize the Base Prisma Client with the PostgreSQL Adapter
    super({ adapter });

    // 3. Compose the "Super Client"
    // Chaining: Pagination -> Versioned Cache -> Tenant Isolation
    this._tenantPrisma = extendedPrismaClient(
      this, 
      this.tenantContext,  
      this.cacheHelper
    );
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connection Pool & Extended Engine established');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error);
    }
  }

  /**
   * THE ACCESSOR: Use this in all Repositories.
   * Example: this.prisma.client.product.paginate(...)
   * 
   * This property returns the fully-featured client that handles
   * security, performance, and caching automatically.
   */
  get client() {
    return this._tenantPrisma;
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Connection Pool drained safely');
  }
}