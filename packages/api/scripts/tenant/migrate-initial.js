#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations');
const TENANT_MIGRATIONS_DIR = path.join(process.cwd(), 'prisma', 'migrations_tenant');

/**
 * This script automates creating a new tenant migration and moving it
 * to the dedicated tenant migrations folder, leaving management migrations untouched.
 */
async function main() {
  try {
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error('❌ Please provide a name for the migration.');
      console.log('Usage: pnpm db:migrate:tenant:initial <migration_name>');
      process.exit(1);
    }
    console.log(`🚀 Creating tenant migration: "${migrationName}"`);

    // 1. Ensure the destination directory exists
    await fs.ensureDir(TENANT_MIGRATIONS_DIR);

    // 2. Get the list of folders in the main migration directory BEFORE creating a new one.
    // This allows us to identify the new folder later.
    const existingFolders = fs.existsSync(MIGRATIONS_DIR) ? fs.readdirSync(MIGRATIONS_DIR) : [];

    // 3. Run the Prisma command. This will add a new subfolder to `prisma/migrations`.
    const command = `npx prisma migrate dev --schema=prisma/tenant.prisma --create-only --name ${migrationName}`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Migration created in default folder.`);

    // 4. Find the name of the new folder that was just created.
    const newFolders = fs.readdirSync(MIGRATIONS_DIR);
    const newFolderName = newFolders.find(folder => !existingFolders.includes(folder));

    if (!newFolderName) {
      throw new Error('Could not find the newly created migration folder. The command may have failed.');
    }

    // 5. Define the source and destination paths for the new folder.
    const sourcePath = path.join(MIGRATIONS_DIR, newFolderName);
    const destPath = path.join(TENANT_MIGRATIONS_DIR, newFolderName);

    // 6. Move ONLY the new folder to our dedicated tenant migrations directory.
    console.log(`🚚 Moving new migration from "${sourcePath}" to "${destPath}"...`);
    await fs.move(sourcePath, destPath, { overwrite: true });

    console.log('\n🎉 SUCCESS! Tenant migration created and moved successfully!');
    console.log(`   Location: ${destPath}`);

  } catch (error) {
    console.error('\n❌ Failed to create and move tenant migration:', error.message);
    process.exit(1);
  }
}

main();