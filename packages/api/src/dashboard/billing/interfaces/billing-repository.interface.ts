// NOTE: For now, this interface is a placeholder for the structure.
// As we determined, most billing logic (fetching subscriptions from the management DB,
// or invoices from Stripe) lives in the service layer, not the tenant repository.
// However, creating this interface maintains the architectural pattern.

export interface IBillingRepository {
  // We can define methods here later if we need to store billing-related
  // information within the tenant's own database schema.
  // Example:
  // findBillingSettings(): Promise<any>;
}

// Define the injection token, just like in your category example
export const IBillingRepository = Symbol('IBillingRepository');