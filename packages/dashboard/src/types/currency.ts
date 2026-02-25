/**
 * SOLID Principle: Single Source of Truth
 * This enum matches the Backend Prisma schema to ensure 
 * consistent currency handling across the global platform.
 */
export enum Currency {
  // Global Tier 1
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  
  // East Africa (Core Market)
  KES = "KES", // Kenya
  UGX = "UGX", // Uganda
  TZS = "TZS", // Tanzania
  
  // West & South Africa (Scale Markets)
  NGN = "NGN", // Nigeria
  GHS = "GHS", // Ghana
  ZAR = "ZAR", // South Africa
  
  // Others
  INR = "INR",
  CAD = "CAD"
}