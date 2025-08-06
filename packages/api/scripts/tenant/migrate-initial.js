#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations');
const TENANT_MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations_tenant');

/**
 * This script automates the creation of a new tenant migration and moves it
 * to the dedicated tenant migrations folder.
 */
async function main() {
  try {
    // 1. Get the name for the migration from the command-line arguments
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error('❌ Please provide a name for the migration.');
      console.log('Usage: pnpm db:migrate:tenant:initial <migration_name>');
      process.exit(1);
    }
    console.log(`🚀 Creating initial tenant migration: "${migrationName}"`);

    // 2. Ensure the destination directory exists
    await fs.ensureDir(TENANT_MIGRATIONS_DIR);

    // 3. Get the list of existing migration folders before we create a new one
    const existingMigrations = fs.readdirSync(MIGRATIONS_DIR);

    // 4. Run the Prisma command to create the migration file in the default location
    const command = `npx prisma migrate dev --schema=prisma/tenant.prisma --create-only --name ${migrationName}`;
    execSync(command, { stdio: 'inherit' });

    // 5. Find the new migration folder that was just created
    const newMigrations = fs.readdirSync(MIGRATIONS_DIR);
    const newFolderName = newMigrations.find(f => !existingMigrations.includes(f));

    if (!newFolderName) {
      throw new Error('Could not find the newly created migration folder.');
    }

    // 6. Define the source and destination paths
    const sourcePath = path.join(MIGRATIONS_DIR, newFolderName);
    const destPath = path.join(TENANT_MIGRATIONS_DIR, newFolderName);

    // 7. Move the new migration folder to our dedicated tenant migrations directory
    console.log(`🚚 Moving migration from "${sourcePath}" to "${destPath}"...`);
    await fs.move(sourcePath, destPath, { overwrite: true });

    console.log('✅ Tenant migration created and moved successfully!');
    console.log(`   Location: ${destPath}`);

  } catch (error) {
    console.error('❌ Failed to create initial tenant migration:', error.message);
    process.exit(1);
  }
}

main();