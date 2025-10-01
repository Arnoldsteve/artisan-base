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
          {/* <Header /> */}
          
          <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
            {/* Wrapper div to add padding only to content, not PageHeader */}
            <div className="space-y-4">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}