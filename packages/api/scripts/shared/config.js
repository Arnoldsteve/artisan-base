const path = require('path');
const { config } = require('dotenv');

// Load environment variables from .env file
config();

const CONFIG = {
  // Use DATABASE_URL from .env for the management database connection
  MANAGEMENT_DATABASE_URL: process.env.DATABASE_URL,

  // Supabase Configuration
  SUPABASE: {
    URL: process.env.SUPABASE_URL,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Other configurations can remain
  // ...
};

// Validation to ensure the database URL is loaded
function validateConfig() {
  if (!CONFIG.MANAGEMENT_DATABASE_URL) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }
  return true;
}

// Validate on import
validateConfig();

module.exports = CONFIG;