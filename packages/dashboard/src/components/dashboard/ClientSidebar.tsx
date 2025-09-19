"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui";
import { Header } from "../dashboard/header";
import { AppSidebar } from "../sidebar/app-sidebar";

interface ClientSidebarProps {
  children: React.ReactNode;
}

export function ClientSidebarLayout({ children }: ClientSidebarProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="flex flex-col h-screen w-full">
          <Header />
          <main className="flex-1 space-y-4 p-8 pt-6 overflow-y-auto">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
