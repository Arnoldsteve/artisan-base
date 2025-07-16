"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
} from "@repo/ui/components/ui/tabs";
import { Profile } from "@/components/account/profile";
import { Orders } from "@/components/account/orders";
import { Wishlist } from "@/components/account/wishlist";
import { Settings as AccountSettings } from "@/components/account/settings";
import { TabList } from "@/components/account/tablist";


const validTabs = ["profile", "orders", "wishlist", "settings"];

export default function AccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab = validTabs.includes(tabParam || "") ? tabParam! : "profile";


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
