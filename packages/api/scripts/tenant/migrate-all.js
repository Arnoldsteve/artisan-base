#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const CONFIG = require('../shared/config');
const {
  getManagementClient,
  createTenantClient,
  disconnect,
} = require('./utils/supabase-client');

async function applyTenantMigrations(schemaName) {
  try {
    console.log(
      `\n🚀 Applying tenant migrations to schema: "${schemaName}"...`,
    );
    const tenantMigrationsDir = path.join(
      process.cwd(),
      'prisma',
      'migrations_tenant',
    );
    if (!fs.existsSync(tenantMigrationsDir)) {
      throw new Error(
        `Tenant migrations directory not found at: ${tenantMigrationsDir}`,
      );
    }
    const migrationFolders = fs
      .readdirSync(tenantMigrationsDir)
      .filter((f) =>
        fs.statSync(path.join(tenantMigrationsDir, f)).isDirectory(),
      )
      .sort();
    if (migrationFolders.length === 0) {
      throw new Error(
        'No tenant migration files found in migrations_tenant folder.',
      );
    }
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
  } catch (error) {
    console.error(
      `❌ Failed to apply tenant migrations for schema ${schemaName}:`,
      error.message,
    );
    throw error;
  }
}

async function main() {
  const managementClient = getManagementClient();
  try {
    // Get all tenants with a dbSchema
    const tenants = await managementClient.tenant.findMany({
      where: { dbSchema: { not: null } },
      select: { dbSchema: true, name: true, subdomain: true },
    });
    if (!tenants.length) {
      console.log('No tenants found in management database.');
      process.exit(0);
    }
    let failed = false;
    for (const tenant of tenants) {
      try {
        await applyTenantMigrations(tenant.dbSchema);
      } catch (err) {
        failed = true;
        console.error(
          `❌ Migration failed for tenant: ${tenant.name} (${tenant.subdomain}) [${tenant.dbSchema}]`,
        );
      }
    }
    await disconnect(managementClient, 'management database');
    if (failed) {
      console.error('\n❌ One or more tenant migrations failed.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tenant migrations applied successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error running migrate-all:', error.message);
    await disconnect(managementClient, 'management database');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
