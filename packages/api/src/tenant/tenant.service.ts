import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
  Logger,
  Inject,
  NotFoundException
} from '@nestjs/common';
import { ITenantRepository } from './interfaces/tenant-repository.interface';
import { Tenant } from 'generated/management';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    @Inject('TenantRepository')
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async getTenantMetadata(tenantId: string) {
    const tenant = await this.tenantRepository.findTenantById(tenantId);

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID '${tenantId}' not found.`);
    }

    // We can customize the returned object later if needed
    return tenant;
  }


  async createTenant(ownerId: string, subdomain: string, storeName: string) {
    const dbSchema = `tenant_${subdomain.replace(/-/g, '_')}`;
    let newTenant: Tenant | null = null;
    let schemaCreated = false;

    try {
      // STEP 0: Validate owner exists
      const owner = await this.tenantRepository.findUserById(ownerId);
      if (!owner)
        throw new BadRequestException(
          `Owner with ID '${ownerId}' does not exist`,
        );
      this.logger.log(`Step 0/4: Verified owner '${ownerId}' exists`);

      // STEP 1: Check if subdomain already exists
      const existingTenant =
        await this.tenantRepository.findTenantBySubdomain(subdomain);
      if (existingTenant)
        throw new ConflictException(
          `Subdomain '${subdomain}' is already taken`,
        );
      this.logger.log(
        `Step 1/4: Verified subdomain '${subdomain}' is available`,
      );

      // STEP 2: Create the Tenant record
      newTenant = await this.tenantRepository.createTenant({
        ownerId,
        subdomain,
        name: storeName,
        dbSchema,
        status: 'ACTIVE',
      });
      this.logger.log(`Step 2/4: Created Tenant record for ${subdomain}`);

      // STEP 3: Create the schema
      await this.tenantRepository.executeRaw(
        `CREATE SCHEMA IF NOT EXISTS "${dbSchema}";`,
      );
      schemaCreated = true;
      this.logger.log(`Step 3/4: Created schema "${dbSchema}"`);

      // STEP 4: Apply migration SQL to the schema
      const migrationSql = await this.tenantRepository.readTenantMigrationSql();
      this.logger.log('Read tenant migration SQL file.');

      const sqlStatements = migrationSql
        .split(';')
        .filter((s) => s.trim() !== '');
      await this.tenantRepository.executeRaw(
        `SET search_path TO "${dbSchema}";`,
      );

      for (const stmt of sqlStatements) {
        await this.tenantRepository.executeRaw(stmt);
      }

      await this.tenantRepository.executeRaw(`SET search_path TO "public";`);
      this.logger.log(`Step 4/4: Successfully migrated schema: ${dbSchema}`);

      return newTenant;
    } catch (error) {
      this.logger.error(
        `Failed to create tenant for subdomain ${subdomain}. Rolling back...`,
        error.stack,
      );
      await this.rollbackTenant(newTenant, dbSchema, subdomain, schemaCreated);
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Could not initialize the store.');
    }
  }

  private async rollbackTenant(
    newTenant: Tenant | null,
    dbSchema: string,
    subdomain: string,
    schemaCreated: boolean,
  ) {
    try {
      if (newTenant) {
        await this.tenantRepository.deleteTenantById(newTenant.id);
        this.logger.warn(`Rolled back: Deleted Tenant record for ${subdomain}`);
      }

      if (schemaCreated) {
        await this.tenantRepository.executeRaw(
          `DROP SCHEMA IF EXISTS "${dbSchema}" CASCADE;`,
        );
        this.logger.warn(`Rolled back: Dropped schema ${dbSchema}`);
      }
    } catch (rollbackError) {
      this.logger.error(
        `Failed to rollback tenant ${subdomain}:`,
        rollbackError.stack,
      );
    }
  }

  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const existing =
      await this.tenantRepository.findTenantBySubdomain(subdomain);
    return !existing;
  }

  async suggestAlternativeSubdomains(base: string): Promise<string[]> {
    const suggestions: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const suggestion = `${base}-${i}`;
      if (await this.isSubdomainAvailable(suggestion))
        suggestions.push(suggestion);
    }
    return suggestions;
  }

  async getSettings(tenantId: string) {
    return this.tenantRepository.getSettings(tenantId);
  }

  async updateSettings(tenantId: string, settings: any) {
    return this.tenantRepository.updateSettings(tenantId, settings);
  }
}
