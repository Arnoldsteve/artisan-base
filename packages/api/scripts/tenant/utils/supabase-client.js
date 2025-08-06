// Import the specific, generated Prisma clients from their correct folders
const { PrismaClient: ManagementPrismaClient } = require('../../../generated/management');
const { PrismaClient: TenantPrismaClient } = require('../../../generated/tenant');
const CONFIG = require('../../shared/config');

// Management DB connection (singleton)
let managementClient = null;

/**
 * Get management database client.
 */
function getManagementClient() {
  if (!managementClient) {
    // Use the specific "ManagementPrismaClient"
    managementClient = new ManagementPrismaClient({
      datasources: {
        db: {
          url: `${CONFIG.MANAGEMENT_DATABASE_URL}?schema=public`,
        },
      },
    });
  }
  return managementClient;
}

/**
 * Create a tenant-specific Prisma client with a dynamic schema URL.
 */
function createTenantClient(schemaUrl) {
  if (!schemaUrl) {
    throw new Error('Schema-specific URL is required for the tenant client');
  }

  // Use the specific "TenantPrismaClient"
  return new TenantPrismaClient({
    datasources: {
      db: {
        url: schemaUrl,
      },
    },
  });
}

/**
 * Test database connection.
 */
async function testConnection(client, dbName = 'database') {
  try {
    await client.$connect();
    console.log(`✅ Connected to ${dbName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to connect to ${dbName}:`, error.message);
    return false;
  }
}

/**
 * Safely disconnect from the database.
 */
async function disconnect(client, dbName = 'database') {
  try {
    await client.$disconnect();
    console.log(`🔌 Disconnected from ${dbName}`);
  } catch (error) {
    console.error(`❌ Error disconnecting from ${dbName}:`, error.message);
  }
}

// Export only the functions that are needed by create.js
module.exports = {
  getManagementClient,
  createTenantClient,
  testConnection,
  disconnect,
};