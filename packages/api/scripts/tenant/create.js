#!/usr/bin/env node

const { execSync } = require('child_process');
const { createId } = require('@paralleldrive/cuid2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../shared/config');
const {
  getManagementClient,
  createTenantClient,
  disconnect,
} = require('./utils/supabase-client');

/**
 * Creates a new tenant schema and applies migrations.
 */
class TenantCreator {
  constructor() {
    this.managementClient = getManagementClient();
  }

  /**
   * Main method to create a tenant.
   */
  async createTenant(tenantData) {
    const {
      name,
      subdomain,
      ownerEmail,
      customDomain = null,
      planId = null,
    } = tenantData;

    const schemaName = `tenant_${subdomain}`;

    console.log(`🚀 Starting tenant creation for: ${name} (${subdomain})`);
    console.log(`   Schema to be created: "${schemaName}"`);

    try {
      // Step 1: Validate input
      await this.validateInput(tenantData);

      // Step 2: Check if subdomain and schema name are available
      await this.checkSubdomainAvailability(subdomain);

      // Step 3: Find or create the owner
      const owner = await this.findOrCreateOwner(ownerEmail);

      // Step 4: Create the tenant record
      const tenant = await this.createTenantRecord({
        name,
        subdomain,
        customDomain,
        ownerId: owner.id,
        planId,
        dbSchema: schemaName,
      });

      // Step 5: Create the actual schema in the database
      await this.createSchema(tenant.dbSchema);

      // Step 6: Apply the tenant migrations to the new schema
      await this.applyTenantMigrations(tenant.dbSchema);

      // Step 7: Update tenant status to ACTIVE
      await this.activateTenant(tenant.id);

      // Step 8: Seed initial data into the new schema
      await this.seedTenantDatabase(tenant.dbSchema, tenant);

      console.log(`✅ Tenant created successfully!`);
      console.log(`   - Tenant ID: ${tenant.id}`);
      console.log(`   - Subdomain: ${subdomain}`);
      console.log(`   - Schema: ${tenant.dbSchema}`);
      console.log(`   - Status: ACTIVE`);

      return tenant;
    } catch (error) {
      console.error(`❌ Failed to create tenant: ${error.message}`);
      // Try to clean up if tenant record was created
      try {
        const existingTenant = await this.managementClient.tenant.findFirst({
          where: { subdomain }
        });
        if (existingTenant) {
          console.log(`🧹 Cleaning up failed tenant creation...`);
          await this.cleanupFailedTenant(existingTenant.dbSchema, existingTenant.id);
        }
      } catch (cleanupError) {
        console.error(`⚠️ Cleanup failed: ${cleanupError.message}`);
      }
      throw error;
    }
  }

  /**
   * Validate input data
   */
  async validateInput(data) {
    const { name, subdomain, ownerEmail } = data;
    
    if (!name || name.trim().length < 2) {
      throw new Error('Tenant name must be at least 2 characters long');
    }
    
    if (!subdomain || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain)) {
      throw new Error('Subdomain must contain only lowercase letters, numbers, and hyphens');
    }
    
    if (subdomain.length < 3 || subdomain.length > 30) {
      throw new Error('Subdomain must be between 3 and 30 characters');
    }
    
    if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
      throw new Error('Valid owner email is required');
    }
    
    console.log(`✅ Input validation passed`);
  }

  /**
   * Check if subdomain and schema name are available
   */
  async checkSubdomainAvailability(subdomain) {
    const schemaName = `tenant_${subdomain}`;
    const existingTenant = await this.managementClient.tenant.findFirst({
      where: { 
        OR: [
          { subdomain }, 
          { dbSchema: schemaName }
        ] 
      },
    });
    
    if (existingTenant) {
      throw new Error(`Subdomain '${subdomain}' is already taken`);
    }
    
    console.log(`✅ Subdomain and schema name are available`);
  } 

  /**
   * Find existing owner or create new one
   */
  async findOrCreateOwner(email) {
    let owner = await this.managementClient.user.findUnique({
      where: { email },
    });
    
    if (!owner) {
      owner = await this.managementClient.user.create({
        data: {
          id: createId(),
          email,
          hashedPassword: 'temp_password_change_me', // TODO: Generate secure password
          role: 'TENANT_OWNER',
        },
      });
      console.log(`✅ Created new owner: ${email}`);
    } else {
      console.log(`✅ Found existing owner: ${email}`);
    }
    
    return owner;
  }

  /**
   * Create the tenant record in the management database
   */
  async createTenantRecord(data) {
    try {
      const tenant = await this.managementClient.tenant.create({
        data: {
          id: createId(),
          ...data,
          status: 'PENDING',
        },
      });
      console.log(`✅ Created tenant record: ${tenant.name}`);
      return tenant;
    } catch (error) {
      console.error(`❌ Failed to create tenant record:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new schema in the database
   */
  async createSchema(schemaName) {
    try {
      console.log(`🔄 Creating schema: "${schemaName}"...`);
      await this.managementClient.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}";`
      );
      console.log(`✅ Schema created successfully`);
    } catch (error) {
      console.error(`❌ Failed to create schema:`, error.message);
      throw error;
    }
  }

  /**
   * Apply tenant migrations to the specified schema
   */
  async applyTenantMigrations(schemaName) {
    try {
      console.log(`🔄 Applying tenant migrations to schema: "${schemaName}"...`);

      const tenantMigrationsDir = path.join(process.cwd(), 'prisma', 'migrations_tenant');
      
      if (!fs.existsSync(tenantMigrationsDir)) {
        throw new Error(`Tenant migrations directory not found at: ${tenantMigrationsDir}`);
      }

      const migrationFolders = fs.readdirSync(tenantMigrationsDir)
        .filter(f => fs.statSync(path.join(tenantMigrationsDir, f)).isDirectory())
        .sort();

      if (migrationFolders.length === 0) {
        throw new Error('No tenant migration files found in migrations_tenant folder.');
      }

      const schemaUrl = `${CONFIG.MANAGEMENT_DATABASE_URL}?schema=${schemaName}`;
      const tenantClient = createTenantClient(schemaUrl);

      for (const folder of migrationFolders) {
        const migrationPath = path.join(tenantMigrationsDir, folder, 'migration.sql');
        
        if (fs.existsSync(migrationPath)) {
          console.log(`   - Applying tenant migration: ${folder}`);
          const sql = fs.readFileSync(migrationPath, 'utf-8');
          
          const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
          for (const statement of statements) {
            await tenantClient.$executeRawUnsafe(statement);
          }
        }
      }

      await tenantClient.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
          id VARCHAR(36) PRIMARY KEY,
          checksum VARCHAR(64) NOT NULL,
          finished_at TIMESTAMPTZ,
          migration_name VARCHAR(255) NOT NULL,
          logs TEXT,
          rolled_back_at TIMESTAMPTZ,
          started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          applied_steps_count INTEGER NOT NULL DEFAULT 0
        );
      `);

      for (const folder of migrationFolders) {
        await tenantClient.$executeRawUnsafe(
          `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
           VALUES ($1, $2, $3, now(), 1) ON CONFLICT (id) DO NOTHING;`,
          `${folder}-manual`, 'manual-apply', folder
        );
      }

      await disconnect(tenantClient, 'tenant database');
      console.log(`✅ Tenant migrations applied successfully`);

    } catch (error) {
      console.error(`❌ Failed to apply tenant migrations:`, error.message);
      throw error;
    }
  }

  /**
   * Update tenant status to ACTIVE
   */
  async activateTenant(tenantId) {
    try {
      await this.managementClient.tenant.update({
        where: { id: tenantId },
        data: { 
          status: 'ACTIVE',
          updatedAt: new Date()
        },
      });
      console.log(`✅ Tenant activated successfully`);
    } catch (error) {
      console.error(`❌ Failed to activate tenant:`, error.message);
      throw error;
    }
  }

  /**
   * Seed initial data into the tenant schema
   */
  async seedTenantDatabase(schemaName, tenant) {
    try {
      console.log(`🔄 Seeding data into schema: "${schemaName}"...`);

      const schemaUrl = `${CONFIG.MANAGEMENT_DATABASE_URL}?schema=${schemaName}`;
      const tenantClient = createTenantClient(schemaUrl);

      await tenantClient.dashboardUser.create({
        data: {
          id: createId(),
          email: `admin@${tenant.subdomain}.localhost`,
          hashedPassword: 'temp_admin_password',
          firstName: 'Admin',
          lastName: 'User',
          role: 'OWNER',
        },
      });

      await tenantClient.category.createMany({
        data: [
          { id: createId(), name: 'General', slug: 'general', description: 'General products category' },
          { id: createId(), name: 'Featured', slug: 'featured', description: 'Featured products' },
        ],
      });

      await disconnect(tenantClient, 'tenant database');
      console.log(`✅ Tenant database seeded successfully`);
    } catch (error) {
      console.error(`❌ Failed to seed tenant database:`, error.message);
    }
  }

  /**
   * Clean up failed tenant creation
   */
  async cleanupFailedTenant(schemaName, tenantId) {
    try {
      await this.managementClient.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
      await this.managementClient.tenant.delete({ where: { id: tenantId } });
      console.log(`✅ Cleanup completed for failed tenant`);
    } catch (error) {
      console.error(`❌ Cleanup failed:`, error.message);
    }
  }

  /**
   * Cleanup method
   */
  async cleanup() {
    await disconnect(this.managementClient, 'management database');
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log(`
Usage: node scripts/tenant/create.js <name> <subdomain> <owner-email> [custom-domain]

Examples:
  node scripts/tenant/create.js "Malaika Beads" "malaikabeads" "owner@example.com"
    `);
    process.exit(1);
  }

  const [name, subdomain, ownerEmail, customDomain] = args;
  const creator = new TenantCreator();

  try {
    await creator.createTenant({
      name,
      subdomain: subdomain.toLowerCase(),
      ownerEmail,
      customDomain,
    });
    console.log(`\n🎉 SUCCESS! Tenant "${name}" is ready to use.`);
  } catch (error) {
    console.error(`\n💥 FAILED! Tenant creation unsuccessful.`);
    process.exit(1);
  } finally {
    await creator.cleanup();
  }
}

if (require.main === module) {
  main();
}

module.exports = { TenantCreator };