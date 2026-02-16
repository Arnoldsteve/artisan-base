import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';
import { TenantContextService } from '@/common/tenant-context/tenant-context.service';
import { PrismaClient } from '@generated/prisma/client';
import { extendedPrismaClient, ExtendedPrismaClient } from './prisma-client.provider';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly _tenantPrisma: ExtendedPrismaClient;

  constructor(private readonly tenantContext: TenantContextService) {
    // 1. Setup Connection Pooling for Global Scale
    const poolConfig: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 30,                       // High performance for concurrent users
      idleTimeoutMillis: 30000,      // Close idle connections to save resources
      connectionTimeoutMillis: 5000, // Fail fast if DB is unreachable
      maxUses: 7500,                 // Prevent memory leaks
    };

    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);

    // 2. Initialize the Base Prisma Client with the Adapter
    super({ adapter });

    // 3. Initialize the Isolated Client (The Extension)
    // We pass 'this' (the base client) to the extension
    this._tenantPrisma = extendedPrismaClient(this, this.tenantContext);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connection Pool established via PostgreSQL Adapter');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error);
    }
  }

  /**
   * USE THIS GETTER: In your services, call this.prisma.client.product...
   * This is the version that is automatically isolated by tenantId.
   */
  get client() {
    return this._tenantPrisma;
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Connection Pool drained safely');
  }
}