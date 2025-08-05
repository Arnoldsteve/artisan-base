// CORRECTED SCRIPT

// 1. Import from the specific folders you generated, and rename the clients
const { PrismaClient: ManagementPrismaClient } = require('../../../generated/management');
const { PrismaClient: TenantPrismaClient } = require('../../../generated/tenant');
const CONFIG = require('../../shared/config'); // This one was correct, leave it as is.

// Management DB connection (singleton)
let managementClient = null;

/**
 * Get management database client
 */
function getManagementClient() {
  if (!managementClient) {
    // 2. Use the specific "ManagementPrismaClient"
    managementClient = new ManagementPrismaClient({
      datasources: {
        db: {
          url: CONFIG.MANAGEMENT_DATABASE_URL,
        },
      },
    });
  }
  return managementClient;
}

/**
 * Create tenant database client with dynamic URL
 */
function createTenantClient(databaseUrl) {
  if (!databaseUrl) {
    throw new Error('Database URL is required for tenant client');
  }

  // 3. Use the specific "TenantPrismaClient"
  return new TenantPrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

/**
 * Test database connection
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
 * Safely disconnect from database
 */
async function disconnect(client, dbName = 'database') {
  try {
    await client.$disconnect();
    console.log(`🔌 Disconnected from ${dbName}`);
  } catch (error) {
    console.error(`❌ Error disconnecting from ${dbName}:`, error.message);
  }
}

/**
 * Get all tenant database URLs from management database
 */
async function getAllTenantDatabaseUrls() {
  const managementClient = getManagementClient();
  
  try {
    const tenants = await managementClient.tenant.findMany({
      where: {
        status: 'ACTIVE',
        databaseUrl: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        databaseUrl: true,
      },
    });

    return tenants.map(tenant => ({
      tenantId: tenant.id,
      tenantName: tenant.name,
      subdomain: tenant.subdomain,
      databaseUrl: tenant.databaseUrl,
    }));
  } catch (error) {
    console.error('❌ Failed to fetch tenant database URLs:', error.message);
    throw error;
  }
}

/**
 * Get single tenant database URL
 */
async function getTenantDatabaseUrl(tenantId) {
  const managementClient = getManagementClient();
  
  try {
    const tenant = await managementClient.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        databaseUrl: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new Error(`Tenant with ID ${tenantId} not found`);
    }

    if (!tenant.databaseUrl) {
      throw new Error(`Tenant ${tenant.name} does not have a database URL`);
    }

    return {
      tenantId: tenant.id,
      tenantName: tenant.name,
      databaseUrl: tenant.databaseUrl,
      status: tenant.status,
    };
  } catch (error) {
    console.error(`❌ Failed to get database URL for tenant ${tenantId}:`, error.message);
    throw error;
  }
}

/**
 * Update tenant database URL in management database
 */
async function updateTenantDatabaseUrl(tenantId, databaseUrl, supabaseProjectId = null) {
  const managementClient = getManagementClient();
  
  try {
    const updatedTenant = await managementClient.tenant.update({
      where: { id: tenantId },
      data: {
        databaseUrl,
        supabaseProjectId,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        databaseUrl: true,
        supabaseProjectId: true,
      },
    });

    console.log(`✅ Updated database URL for tenant: ${updatedTenant.name}`);
    return updatedTenant;
  } catch (error) {
    console.error(`❌ Failed to update database URL for tenant ${tenantId}:`, error.message);
    throw error;
  }
}

module.exports = {
  getManagementClient,
  createTenantClient,
  testConnection,
  disconnect,
  getAllTenantDatabaseUrls,
  getTenantDatabaseUrl,
  updateTenantDatabaseUrl,
};