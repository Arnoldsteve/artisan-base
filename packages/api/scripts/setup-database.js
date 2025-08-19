#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up database for multitenant architecture...\n');

async function setupDatabase() {
  try {
    // Step 1: Reset management database
    console.log('1️⃣ Resetting management database...');
    execSync('pnpm db:reset:management', { stdio: 'inherit' });
    console.log('✅ Management database reset complete\n');

    // Step 2: Generate Prisma clients
    console.log('2️⃣ Generating Prisma clients...');
    execSync('pnpm db:generate', { stdio: 'inherit' });
    console.log('✅ Prisma clients generated\n');

    // Step 3: Check if tenant migrations exist
    const tenantMigrationsDir = path.join(
      process.cwd(),
      'prisma',
      'migrations_tenant',
    );
    if (!fs.existsSync(tenantMigrationsDir)) {
      console.log(
        '⚠️  No tenant migrations found. Creating initial tenant migration...',
      );
      execSync('pnpm db:migrate:tenant:initial init_tenant', {
        stdio: 'inherit',
      });
      console.log('✅ Initial tenant migration created\n');
    } else {
      const migrationFolders = fs
        .readdirSync(tenantMigrationsDir)
        .filter((f) =>
          fs.statSync(path.join(tenantMigrationsDir, f)).isDirectory(),
        );
      console.log(`✅ Found ${migrationFolders.length} tenant migration(s)\n`);
    }

    console.log('🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log(
      '   1. Create a tenant: pnpm tenant:create "Store Name" "subdomain" "owner@email.com"',
    );
    console.log(
      '   2. Apply schema changes to all tenants: pnpm tenant:migrate-all',
    );
    console.log('\n💡 Tips:');
    console.log('   - Management tables are in the public schema');
    console.log(
      '   - Tenant tables are in tenant-specific schemas (e.g., tenant_subdomain)',
    );
    console.log(
      '   - Use pnpm db:migrate:tenant:initial <name> to create new tenant migrations',
    );
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Manual steps to fix:');
    console.log('   1. pnpm db:reset:management');
    console.log('   2. pnpm db:generate');
    console.log('   3. pnpm db:migrate:tenant:initial init_tenant (if needed)');
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}
