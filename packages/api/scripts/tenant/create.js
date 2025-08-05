#!/usr/bin/env node

const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const { createId } = require('@paralleldrive/cuid2');
const CONFIG = require('../shared/config');
const {
  getManagementClient,
  createTenantClient,
  testConnection,
  disconnect,
  updateTenantDatabaseUrl,
} = require('./utils/supabase-client');

/**
 * Create a new tenant database and apply schema
 */
class TenantCreator {
  constructor() {
    this.managementClient = getManagementClient();
    this.supabase = null;

    if (CONFIG.SUPABASE.URL && CONFIG.SUPABASE.SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        CONFIG.SUPABASE.URL,
        CONFIG.SUPABASE.SERVICE_ROLE_KEY,
      );
    }
  }

  /**
   * Main method to create a tenant
   */
  async createTenant(tenantData) {
    const {
      name,
      subdomain,
      ownerEmail,
      customDomain = null,
      planId = null,
    } = tenantData;

    console.log(`🚀 Starting tenant creation for: ${name} (${subdomain})`);

    try {
      // Step 1: Validate input
      await this.validateInput(tenantData);

      // Step 2: Check if subdomain is available
      await this.checkSubdomainAvailability(subdomain);

      // Step 3: Find or create owner
      const owner = await this.findOrCreateOwner(ownerEmail);

      // Step 4: Create Supabase project (if using Supabase)
      const dbConfig = await this.createTenantDatabase(subdomain);

      // Step 5: Create tenant record in management database
      const tenant = await this.createTenantRecord({
        name,
        subdomain,
        customDomain,
        ownerId: owner.id,
        planId,
        databaseUrl: dbConfig.databaseUrl,
        supabaseProjectId: dbConfig.projectId,
      });

      // Step 6: Apply tenant schema to new database
      await this.applyTenantSchema(dbConfig.databaseUrl);

      // Step 7: Seed initial data (optional)
      await this.seedTenantDatabase(dbConfig.databaseUrl, tenant);

      console.log(`✅ Tenant created successfully!`);
      console.log(`   - Tenant ID: ${tenant.id}`);
      console.log(`   - Subdomain: ${subdomain}`);
      console.log(`   - Database: ${dbConfig.projectId || 'Custom'}`);

      return tenant;
    } catch (error) {
      console.error(`❌ Failed to create tenant: ${error.message}`);
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
      throw new Error(
        'Subdomain must contain only lowercase letters, numbers, and hyphens',
      );
    }

    if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
      throw new Error('Valid owner email is required');
    }

    console.log(`✅ Input validation passed`);
  }

  /**
   * Check if subdomain is available
   */
  async checkSubdomainAvailability(subdomain) {
    const existingTenant = await this.managementClient.tenant.findUnique({
      where: { subdomain },
    });

    if (existingTenant) {
      throw new Error(`Subdomain '${subdomain}' is already taken`);
    }

    console.log(`✅ Subdomain '${subdomain}' is available`);
  }

  /**
   * Find existing owner or create new one
   */
  async findOrCreateOwner(email) {
    let owner = await this.managementClient.user.findUnique({
      where: { email },
    });

    if (!owner) {
      // Create new user (you might want to handle password differently)
      owner = await this.managementClient.user.create({
        data: {
          id: createId(),
          email,
          hashedPassword: 'temp_password_change_me', // TODO: Handle properly
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
   * Create tenant database (Supabase or custom)
   */
  async createTenantDatabase(subdomain) {
    if (this.supabase) {
      return await this.createSupabaseProject(subdomain);
    } else {
      return await this.createCustomDatabase(subdomain);
    }
  }

  /**
   * Create Supabase project for tenant
   */
  async createSupabaseProject(subdomain) {
    try {
      console.log(`🔄 Creating Supabase project for ${subdomain}...`);

      // Note: Supabase doesn't have a public API for creating projects yet
      // You'll need to either:
      // 1. Use Supabase CLI programmatically
      // 2. Create projects manually and provide the connection string
      // 3. Use a different database provider

      // For now, this is a placeholder - you'll need to implement based on your setup
      const projectId = `${subdomain}-${createId()}`;
      const databaseUrl = `postgresql://postgres:[password]@db.${projectId}.supabase.co:5432/postgres`;

      console.log(
        `⚠️  Manual step required: Create Supabase project for ${subdomain}`,
      );
      console.log(`   Project ID: ${projectId}`);

      return {
        projectId,
        databaseUrl:
          process.env.TENANT_DATABASE_URL_TEMPLATE?.replace(
            '{subdomain}',
            subdomain,
          ) || databaseUrl,
      };
    } catch (error) {
      console.error(`❌ Failed to create Supabase project:`, error.message);
      throw error;
    }
  }

  /**
   * Create custom database for tenant
   */
  async createCustomDatabase(subdomain) {
    // If you're using a different database provider or custom setup
    const databaseUrl = process.env.TENANT_DATABASE_URL_TEMPLATE?.replace(
      '{subdomain}',
      subdomain,
    );

    if (!databaseUrl) {
      throw new Error(
        'TENANT_DATABASE_URL_TEMPLATE environment variable is required for custom databases',
      );
    }

    return {
      projectId: null,
      databaseUrl,
    };
  }

  /**
   * Create tenant record in management database
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
   * Apply tenant schema to new database
   */
  async applyTenantSchema(databaseUrl) {
    try {
      console.log(`🔄 Applying tenant schema...`);

      // Test connection first
      const tenantClient = createTenantClient(databaseUrl); // <-- THIS LINE IS NOW CORRECTED
      const connected = await testConnection(tenantClient, 'tenant database');

      if (!connected) {
        throw new Error('Cannot connect to tenant database');
      }

      // Create a new environment object for the child process.
      // This is the correct way to pass environment variables in Node.js
      // and it works on both Windows and Linux/macOS.
      const childEnv = {
        ...process.env,
        TENANT_MIGRATION_URL: databaseUrl, // Explicitly set/override the database URL
      };

      // Execute the command, passing the modified environment in the options.
      execSync(`npx prisma migrate deploy --schema=prisma/tenant.prisma`, {
        env: childEnv,
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      await disconnect(tenantClient, 'tenant database');
      console.log(`✅ Tenant schema applied successfully`);
    } catch (error) {
      console.error(`❌ Failed to apply tenant schema:`, error.message);
      throw error;
    }
  }

  /**
   * Seed initial data in tenant database
   */
  async seedTenantDatabase(databaseUrl, tenant) {
    try {
      console.log(`🔄 Seeding tenant database...`);

      const tenantClient = createTenantClient(databaseUrl);

      // Create default dashboard user (admin)
      await tenantClient.dashboardUser.create({
        data: {
          id: createId(),
          email: 'admin@' + tenant.subdomain + '.com',
          hashedPassword: 'temp_admin_password', // TODO: Generate secure password
          firstName: 'Admin',
          lastName: 'User',
          role: 'OWNER',
        },
      });

      // Create default categories
      await tenantClient.category.createMany({
        data: [
          { id: createId(), name: 'General', slug: 'general' },
          { id: createId(), name: 'Featured', slug: 'featured' },
        ],
      });

      await disconnect(tenantClient, 'tenant database');
      console.log(`✅ Tenant database seeded successfully`);
    } catch (error) {
      console.error(`❌ Failed to seed tenant database:`, error.message);
      // Don't throw - seeding failure shouldn't break tenant creation
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

  if (args.length === 0) {
    console.log(`
Usage: node scripts/tenant/create.js <name> <subdomain> <owner-email> [custom-domain]

Examples:
  node scripts/tenant/create.js "Malaika Beads" "malaikabeads" "owner@example.com"
  node scripts/tenant/create.js "Tech Store" "techstore" "admin@techstore.com" "techstore.com"
    `);
    process.exit(1);
  }

  const [name, subdomain, ownerEmail, customDomain] = args;

  const creator = new TenantCreator();

  try {
    await creator.createTenant({
      name,
      subdomain,
      ownerEmail,
      customDomain,
    });
  } catch (error) {
    console.error(`❌ Tenant creation failed:`, error.message);
    process.exit(1);
  } finally {
    await creator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { TenantCreator };