import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TenantPrismaService {
  private clients: Map<string, PrismaClient> = new Map();

  /**
   * Returns a PrismaClient instance configured for a specific tenant schema.
   * Caches clients to avoid creating new connections on every request.
   * @param tenantId The ID of the tenant.
   * @returns A tenant-specific PrismaClient.
   */
  getClient(tenantId: string): PrismaClient {
    // If we already have a client for this tenant, return it.
    if (this.clients.has(tenantId)) {
      return this.clients.get(tenantId)!;
    }

    // Get the main database URL from environment variables.
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set in environment variables.');
    }

    // Construct a new URL with the tenant's schema specified.
    const urlWithSchema = `${databaseUrl}?schema=tenant_${tenantId}`;

    // Create a new PrismaClient instance with this specific datasource URL.
    const tenantClient = new PrismaClient({
      datasources: {
        db: {
          url: urlWithSchema,
        },
      },
    });

    // Cache the new client for future requests.
    this.clients.set(tenantId, tenantClient);

    return tenantClient;
  }
}