"use client";

import { ClientSidebarLayout } from "@/components/dashboard/ClientSidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ClientSidebarLayout>{children}</ClientSidebarLayout>;
}
