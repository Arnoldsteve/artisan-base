// In packages/web/src/app/dashboard/layout.tsx
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

// This is the layout for all pages inside the /dashboard folder
export default function Layout({ children }: { children: React.ReactNode }) {
  // It wraps all child pages with the DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
}