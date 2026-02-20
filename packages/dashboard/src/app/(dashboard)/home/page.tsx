'use client';
import HomePage from "@/components/home/home-page";
import { PageHeader } from "@/components/shared/page-header";


export default function DashboardPage() {

  return (
    <>
        <PageHeader title="Dashboard Overview"/>
    
     <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground text-sm">Welcome to your dashboard 🎉</p>
    </div>
    {/* // <HomePage/> */}
    </>
  );
}