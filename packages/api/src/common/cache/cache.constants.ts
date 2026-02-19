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

/**
 * Enterprise TTL Policy (in Milliseconds)
 */
export const CACHE_TTLS: Record<CACHE_NAMESPACE, number> = {
  [CACHE_NAMESPACE.PRODUCT_LIST]: 600000,    // 10 Min
  [CACHE_NAMESPACE.PRODUCT_PROFILE]: 3600000, // 1 Hour
  [CACHE_NAMESPACE.DASHBOARD_STATS]: 120000,  // 2 Min
  // ... Default fallback
  DEFAULT: 300000
} as any;