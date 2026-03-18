"use client";

import * as React from "react";
import {
  AudioWaveform,
  Package,
  ShoppingCart,
  Command,
  Users,
  GalleryVerticalEnd,
  BarChart3,
  Settings2,
  LayoutDashboard,
  Star, // Added for Reviews
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/ui/sidebar";
import { useAuthContext } from "@/contexts/auth-context";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/home",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "New Order", url: "/orders/new" },
        {
          title: "All Orders",
          url: "/orders",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Products Categories",
          url: "/product-categories",
        },
      ],
    },
    // ==================== NEW REVIEWS SECTION ====================
    {
      title: "Reviews",
      url: "#",
      icon: Star,
      items: [
        {
          title: "Product Reviews",
          url: "/reviews",
        },
      ],
    },
    // =============================================================
    {
      title: "Customers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/customers",
        },
        // { title: "Loyal Customers", url: "/loyal-customers" },
        // { title: "Big Spenders", url: "/big-spenders" },
        // { title: "At Risk", url: "/at-risk" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Store",
          url: "/settings/store",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
    {
      title: "Analytics",
      url: "analytics",
      icon: BarChart3,
      items: [
        {
          title: "Reports",
          url: "/analytics/reports",
        },
        {
          title: "Sales & Marketing",
          url: "/analytics/sales-marketing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Staff",
      url: "/staff",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { tenants } = useAuthContext();
  
  // Enterprise Standard: Mapping backend tenants to UI Switcher teams
  const mappedTeams = tenants.map((tenant) => ({
    id: tenant.id, // Mandatory for context switching
    name: tenant.name,
    logo: GalleryVerticalEnd,
    plan: tenant.status || "Active",
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={mappedTeams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}