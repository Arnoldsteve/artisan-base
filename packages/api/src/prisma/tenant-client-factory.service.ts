import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
// Use the correct import path for your generated tenant client
import { PrismaClient } from '../../generated/tenant';

@Injectable()
export class TenantClientFactory implements OnModuleDestroy {
  // This map will store the long-lived, connected clients.
  private readonly clients = new Map<string, PrismaClient>();
  private readonly logger = new Logger(TenantClientFactory.name);

  /**
   * Retrieves or creates a Prisma Client for a specific tenant schema.
   * This is now an ASYNC method to ensure the connection is ready before use.
   * @param tenantSchema The unique schema name for the tenant.
   * @returns A promise that resolves to a connected PrismaClient instance.
   */
  async getClient(tenantSchema: string): Promise<PrismaClient> {
    // 1. Check if a connected client already exists in our cache.
    if (this.clients.has(tenantSchema)) {
      this.logger.log(`Returning existing client for schema: ${tenantSchema}`);
      return this.clients.get(tenantSchema)!;
    }

    // 2. If no client exists, create a new one.
    this.logger.log(`Creating new Prisma client for schema: ${tenantSchema}`);
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }

    // ✅ Use proper separator - & if URL already has ?, otherwise ?
    const separator = databaseUrl.includes('?') ? '&' : '?';
    const urlWithSchema = `${databaseUrl}${separator}schema=${tenantSchema}`;

    const newClient = new PrismaClient({
      datasources: {
        db: {
          url: urlWithSchema,
        },
      },
    });

    try {
      // 3. IMPORTANT: Await the connection to ensure it's successful.
      await newClient.$connect();
      this.logger.log(`Successfully connected to schema: ${tenantSchema}`);

      // 4. Store the new, connected client in the cache for future requests.
      this.clients.set(tenantSchema, newClient);

      return newClient;
    } catch (error) {
      this.logger.error(
        `Failed to connect to schema: ${tenantSchema}`,
        error.stack,
      );
      // If connection fails, disconnect the failed client and re-throw the error.
      await newClient.$disconnect();
      throw new Error(
        `Could not connect to database for schema ${tenantSchema}.`,
      );
    }
  }

  /**
   * On application shutdown, disconnect all active tenant clients.
   */
  async onModuleDestroy() {
    this.logger.log('Disconnecting all tenant clients...');
    await Promise.all(
      [...this.clients.values()].map((client) => client.$disconnect()),
    );
  }
}
