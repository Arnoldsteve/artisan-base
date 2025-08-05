const path = require('path');
const { config } = require('dotenv');

// Load environment variables
config();

const CONFIG = {
  // Database URLs
  MANAGEMENT_DATABASE_URL: process.env.MANAGEMENT_DATABASE_URL,
  
  // Supabase Configuration
  SUPABASE: {
    URL: process.env.SUPABASE_URL,
    ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
  },

  // Prisma Schema Paths
  SCHEMAS: {
    MANAGEMENT: path.join(__dirname, '../../prisma/management.prisma'),
    TENANT: path.join(__dirname, '../../prisma/tenant.prisma'),
  },

  // Migration Paths
  MIGRATIONS: {
    TENANT: path.join(__dirname, '../../prisma/migrations-tenant'),
  },

  // Tenant Database Configuration
  TENANT_DB: {
    // Default settings for new tenant databases
    DEFAULT_POOL_SIZE: 5,
    CONNECTION_TIMEOUT: 30000,
    IDLE_TIMEOUT: 300000,
  },

  // Script Configuration
  SCRIPTS: {
    MAX_CONCURRENT_OPERATIONS: 5,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
  },

  // Logging Configuration
  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    FORMAT: 'json',
  },
};

// Validation
function validateConfig() {
  const required = [
    'MANAGEMENT_DATABASE_URL',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Validate on import
validateConfig();

module.exports = CONFIG;