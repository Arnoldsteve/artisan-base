import { DashboardWrapper } from "./components/dashboard-wrapper";

/**
 * SOLID Principle: Interface Segregation
 * This page serves as the entry point, delegating all 
 * client-side state and logic to the DashboardWrapper.
 */
export default function DashboardHomePage() {
  return <DashboardWrapper />;
}