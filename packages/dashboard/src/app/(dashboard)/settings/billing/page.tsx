import { BillingWrapper } from "./components/billing-wrapper";

/**
 * SOLID Principle: Interface Segregation
 * The page serves as a simple entry point, delegating all 
 * client-side state and logic to the BillingWrapper.
 */
export default function BillingPage() {
  return <BillingWrapper />;
}