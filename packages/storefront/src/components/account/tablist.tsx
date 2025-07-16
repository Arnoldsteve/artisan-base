"use client";
import React from "react";
import { TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { User, Package, Heart, Settings } from "lucide-react";
import { useWishlistContext } from "@/contexts/wishlist-context";

export const TabList: React.FC = () => {
  const { items: wishlistItems } = useWishlistContext();
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="profile" className="flex items-center space-x-2">
        <User className="h-4 w-4" />
        <span>Profile</span>
      </TabsTrigger>
      <TabsTrigger value="orders" className="flex items-center space-x-2">
        <Package className="h-4 w-4" />
        <span>Orders</span>
      </TabsTrigger>
      <TabsTrigger value="wishlist" className="flex items-center space-x-2">
        <Heart className="h-4 w-4" />
        <span>
          Wishlist
          {wishlistItems.length > 0 ? ` (${wishlistItems.length})` : ""}
        </span>
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center space-x-2">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};
