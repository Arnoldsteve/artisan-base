"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { User, Package, Heart, Settings, LogOut, Edit } from "lucide-react";
import { toast } from "sonner";
import { useWishlistContext } from "@/contexts/wishlist-context";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCartContext } from "@/contexts/cart-context";
import { Profile } from "@/components/account/profile";
import { Orders } from "@/components/account/orders";
import { Wishlist } from "@/components/account/wishlist";
import { Settings as AccountSettings } from "@/components/account/settings";
import { TabList } from "@/components/account/tablist";

// Mock user data
const mockUser = {
  id: "1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

// Mock order history
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 149.97,
    items: [
      { name: "Handcrafted Ceramic Mug", quantity: 2, price: 24.99 },
      { name: "Wooden Cutting Board", quantity: 1, price: 89.99 },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 89.99,
    items: [{ name: "Handwoven Basket", quantity: 1, price: 89.99 }],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 199.98,
    items: [{ name: "Leather Journal", quantity: 2, price: 99.99 }],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const validTabs = ["profile", "orders", "wishlist", "settings"];

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab = validTabs.includes(tabParam || "") ? tabParam! : "profile";

  const { items: wishlistItems, removeFromWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  const handleTabChange = (tab: string) => {
    if (tab === "profile") {
      router.push("/account");
    } else if (validTabs.includes(tab)) {
      router.push(`/account?tab=${tab}`);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    // In a real app, this would clear auth state and redirect
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
