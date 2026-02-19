import { CACHE_NAMESPACE } from './cache.constants';

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * Enterprise Cache TTL Policy (in Seconds)
 * This is the ONLY place where "Magic Numbers" for time are allowed.
 */
export const CACHE_TTLS: Record<string, number> = { 
  [CACHE_NAMESPACE.PRODUCT_LIST]: 1 * HOUR,
  [CACHE_NAMESPACE.PRODUCT_PROFILE]: 2 * HOUR,

  [CACHE_NAMESPACE.CATEGORY_LIST]: 24 * HOUR,

  [CACHE_NAMESPACE.DASHBOARD_STATS]: 1 * MIN,

  [CACHE_NAMESPACE.SEARCH_RESULTS]: 2 * MIN,

  [CACHE_NAMESPACE.ORDER_LIST]: 5 * MIN,

  [CACHE_NAMESPACE.USER_PROFILE]: 1 * HOUR,
  
  [CACHE_NAMESPACE.TENANT_CONFIG]: 1 * DAY,
  [CACHE_NAMESPACE.TENANT_MEMBER_LIST]: 1 * HOUR,

  DEFAULT: 300, // 5 Minutes fallback
};
