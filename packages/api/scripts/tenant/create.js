#!/usr/bin/env node

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
 * Robust Tenant Creation Script
 * - Creates tenant record in management DB
 * - Creates schema
 * - Applies tenant migrations
 * - Seeds initial data
 * - Cleans up on failure
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log(
      `\nUsage: node scripts/tenant/create.js <name> <subdomain> <owner-email> [custom-domain]\n`,
    );
    process.exit(1);
  }
  const [name, subdomain, ownerEmail, customDomain] = args;
  const schemaName = `tenant_${subdomain}`;
  const managementClient = getManagementClient();
  let tenant = null;
  try {
    // 1. Validate input
    if (!name || name.trim().length < 2)
      throw new Error('Tenant name must be at least 2 characters long');
    if (!subdomain || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain))
      throw new Error(
        'Subdomain must contain only lowercase letters, numbers, and hyphens',
      );
    if (subdomain.length < 3 || subdomain.length > 30)
      throw new Error('Subdomain must be between 3 and 30 characters');
    if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))
      throw new Error('Valid owner email is required');
    console.log('✅ Input validation passed');

    // 2. Check subdomain/schema availability
    const existing = await managementClient.tenant.findFirst({
      where: { OR: [{ subdomain }, { dbSchema: schemaName }] },
    });
    if (existing)
      throw new Error(
        `Subdomain '${subdomain}' or schema '${schemaName}' already exists.`,
      );
    console.log('✅ Subdomain and schema name are available');

    // 3. Find or create owner
    let owner = await managementClient.user.findUnique({
      where: { email: ownerEmail },
    });
    if (!owner) {
      owner = await managementClient.user.create({
        data: {
          id: createId(),
          email: ownerEmail,
          hashedPassword: 'temp_password_change_me',
          role: 'TENANT_OWNER',
        },
      });
      console.log(`✅ Created new owner: ${ownerEmail}`);
    } else {
      console.log(`✅ Found existing owner: ${ownerEmail}`);
    }

    // 4. Create tenant record
    tenant = await managementClient.tenant.create({
      data: {
        id: createId(),
        name,
        subdomain,
        customDomain: customDomain || null,
        ownerId: owner.id,
        dbSchema: schemaName,
        status: 'PENDING',
      },
    });
    console.log(`✅ Created tenant record: ${tenant.name}`);

    // 5. Create schema
    await managementClient.$executeRawUnsafe(
      `CREATE SCHEMA IF NOT EXISTS "${schemaName}";`,
    );
    console.log(`✅ Schema created: ${schemaName}`);

    // 6. Apply tenant migrations
    await applyTenantMigrations(schemaName);

    // 7. Seed initial data
    await seedTenantDatabase(schemaName, tenant, subdomain);

    // 8. Activate tenant
    await managementClient.tenant.update({
      where: { id: tenant.id },
      data: { status: 'ACTIVE', updatedAt: new Date() },
    });
    console.log('✅ Tenant activated and ready!');
    await disconnect(managementClient, 'management database');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Cleanup
    if (tenant) {
      try {
        await managementClient.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`,
        );
        await managementClient.tenant.delete({ where: { id: tenant.id } });
        console.log('🧹 Cleanup complete.');
      } catch (cleanupError) {
        console.error(`⚠️ Cleanup failed: ${cleanupError.message}`);
      }
    }
    await disconnect(managementClient, 'management database');
    process.exit(1);
  }
}

async function applyTenantMigrations(schemaName) {
  const tenantMigrationsDir = path.join(
    process.cwd(),
    'prisma',
    'migrations_tenant',
  );
  if (!fs.existsSync(tenantMigrationsDir))
    throw new Error(
      `Tenant migrations directory not found at: ${tenantMigrationsDir}`,
    );
  const migrationFolders = fs
    .readdirSync(tenantMigrationsDir)
    .filter((f) => fs.statSync(path.join(tenantMigrationsDir, f)).isDirectory())
    .sort();
  if (migrationFolders.length === 0)
    throw new Error(
      'No tenant migration files found in migrations_tenant folder.',
    );
  const schemaUrl = `${CONFIG.MANAGEMENT_DATABASE_URL}?schema=${schemaName}`;
  const tenantClient = createTenantClient(schemaUrl);
  for (const folder of migrationFolders) {
    const migrationPath = path.join(
      tenantMigrationsDir,
      folder,
      'migration.sql',
    );
    if (fs.existsSync(migrationPath)) {
      console.log(`   - Applying tenant migration: ${folder}`);
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      const statements = sql
        .split(';')
        .filter((stmt) => stmt.trim().length > 0);
      for (const statement of statements) {
        await tenantClient.$executeRawUnsafe(statement);
      }
    }
  }
  await disconnect(tenantClient, `tenant database (${schemaName})`);
  console.log(
    `✅ Tenant migrations applied successfully for schema: ${schemaName}`,
  );
}

async function seedTenantDatabase(schemaName, tenant, subdomain) {
  const schemaUrl = `${CONFIG.MANAGEMENT_DATABASE_URL}?schema=${schemaName}`;
  const tenantClient = createTenantClient(schemaUrl);
  await tenantClient.dashboardUser.create({
    data: {
      id: createId(),
      email: `admin@${subdomain}.localhost`,
      hashedPassword: 'temp_admin_password',
      firstName: 'Admin',
      lastName: 'User',
      role: 'OWNER',
    },
  });
  await tenantClient.category.createMany({
    data: [
      {
        id: createId(),
        name: 'General',
        slug: 'general',
        description: 'General products category',
      },
      {
        id: createId(),
        name: 'Featured',
        slug: 'featured',
        description: 'Featured products',
      },
    ],
  });
  await disconnect(tenantClient, `tenant database (${schemaName})`);
  console.log('✅ Tenant database seeded successfully');
}

if (require.main === module) {
  main();
}
