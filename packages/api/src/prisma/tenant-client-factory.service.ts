import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/tenant';

@Injectable()
export class TenantClientFactory implements OnModuleDestroy {
  private clients = new Map<string, PrismaClient>();
  private readonly logger = new Logger(TenantClientFactory.name);

  getTenantClient(tenantSchema: string): PrismaClient {
    if (!this.clients.has(tenantSchema)) {
      this.logger.log(`Creating new Prisma client for schema: ${tenantSchema}`);
      const databaseUrl = process.env.DATABASE_URL;
      const urlWithSchema = `${databaseUrl}?schema=${tenantSchema}`;
      const client = new PrismaClient({
        datasources: {
          db: {
            url: urlWithSchema,
          },
        },
      });
      this.clients.set(tenantSchema, client);
    }
    return this.clients.get(tenantSchema)!;
  }

  async onModuleDestroy() {
    for (const [schema, client] of this.clients.entries()) {
      await client.$disconnect();
      this.logger.log(`Disconnected client for schema: ${schema}`);
    }
    this.clients.clear();
  }
} 