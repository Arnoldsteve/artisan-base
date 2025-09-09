import { Header } from '@/components/dashboard/header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
// Import SidebarInset from your UI package!
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@repo/ui";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      {/* 1. The sidebar sits here */}
      <AppSidebar />

      {/* 2. The SidebarInset wraps ALL other content */}
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