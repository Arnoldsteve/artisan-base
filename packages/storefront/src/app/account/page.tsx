"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@repo/ui/components/ui/tabs";
import { Profile } from "@/components/account/profile";
import { Orders } from "@/components/account/orders/orders";
import { Wishlist } from "@/components/account/wishlist";
import { Settings as AccountSettings } from "@/components/account/settings";
import { TabList } from "@/components/account/tablist";
import { useEffect, Suspense } from "react";
import { useAuthContext } from "@/contexts/auth-context";

const validTabs = ["profile", "orders", "wishlist", "settings"];

// Loading component
function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Account content component
function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab = validTabs.includes(tabParam || "") ? tabParam! : "profile";
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <AccountLoading />;
  if (!isAuthenticated) return null;

  const handleTabChange = (tab: string) => {
    if (tab === "profile") {
      router.push("/account");
    } else if (validTabs.includes(tab)) {
      router.push(`/account?tab=${tab}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Manage your profile, orders, and preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabList />

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Profile />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Orders />
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-6">
          <Wishlist />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main page component with Suspense
export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountContent />
    </Suspense>
  );
}