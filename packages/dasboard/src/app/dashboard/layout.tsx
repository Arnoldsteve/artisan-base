import { Header } from '@/components/dashboard/header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // The hidden overflow prevents scrollbars from the main layout
    // while allowing internal scrolling in the dashboard content.
    <div className="flex flex-col h-screen w-full">
        <Header />
      <main className="flex-1 space-y-4 p-8 pt-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}