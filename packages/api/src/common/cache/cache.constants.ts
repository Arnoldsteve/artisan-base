/**
 * Enterprise Cache Namespaces
 * Maps business domains to versioned cache buckets.
 */
export enum CACHE_NAMESPACE {
  // Core Commerce
  PRODUCT_LIST = 'PRODUCT_LIST',
  PRODUCT_PROFILE = 'PRODUCT_PROFILE',
  CATEGORY_LIST = 'CATEGORY_LIST',
  ORDER_LIST = 'ORDER_LIST',

  // Tenant & Identity
  USER_PROFILE = 'USER_PROFILE',
  TENANT_CONFIG = 'TENANT_CONFIG',
  TENANT_MEMBER_LIST = 'TENANT_MEMBER_LIST',

  // Analytics
  DASHBOARD_STATS = 'DASHBOARD_STATS',
  SEARCH_RESULTS = 'SEARCH_RESULTS',
}
