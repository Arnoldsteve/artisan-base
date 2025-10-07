"use client";

import { SidebarProvider, SidebarInset } from "@repo/ui";
import { AppSidebar } from "../sidebar/app-sidebar";
import { useEffect, useState } from "react";

interface ClientSidebarProps {
  children: React.ReactNode;
}

export function ClientSidebarLayout({ children }: ClientSidebarProps) {
  const [open, setOpen] = useState(true);

  // Load saved state on mount
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-open");
    if (stored !== null) {
      setOpen(stored === "true");
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-open", String(open));
  }, [open]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen w-full">
          <main className="flex-1 overflow-y-auto bg-[#f4f4f4]">
            <div className="space-y-4">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}