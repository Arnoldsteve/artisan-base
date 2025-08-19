import { PrismaClient, UserRole } from '../../generated/management/index.js';
import * as bcrypt from 'bcrypt';

// Instantiate the client that connects to the management database
const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Platform Admin ---');

  // Define your admin credentials. Use environment variables for production.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saas.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  if (!adminPassword || adminPassword === 'ChangeMe123!') {
    console.warn(
      'WARNING: Using default or insecure admin password. Please set ADMIN_PASSWORD in your .env file.',
    );
  }

  // Check if the admin user already exists to avoid creating duplicates
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user with email '${adminEmail}' already exists. Skipping.`);
  } else {
    // If the user doesn't exist, create them with the PLATFORM_ADMIN role
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        hashedPassword: hashedPassword,
        firstName: 'Platform',
        lastName: 'Admin',
        role: UserRole.PLATFORM_ADMIN,
      },
    });

    console.log(`Successfully created PLATFORM_ADMIN user: ${adminUser.email}`);
  }

  console.log('--- Platform Admin seeding finished ---');
}

// Execute the main function and handle potential errors
main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ensure the Prisma client is disconnected after the script runs
    await prisma.$disconnect();
  });