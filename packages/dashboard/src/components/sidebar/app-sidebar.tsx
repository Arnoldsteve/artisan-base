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
  PieChart,
  Settings2,
  LayoutDashboard,
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
import { title } from "process";
import { useAuthContext } from "@/contexts/auth-context";

// This is sample data.
const data = {
  user: {
    name: "Steve Arnold",
    email: "stevearnold@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Satechs Solutions",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Syparn Inc.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Safaricom LLC.",
      logo: Command,
      plan: "Free",
    },
  ],
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
    {
      title: "Customers", // use recency, frequency, and monetary value (RFM model)
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/customers",
        },
        { title: "Loyal Customers", url: "/loyal-customers" },
        { title: "Big Spenders", url: "big-spenders" },
        { title: "At Risk", url: "at-risk" },
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
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Reports",
          url: "/reports",
        },
        {
          title: "Sales & Marketing",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Users",
      url: "/users",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { user, tenants } = useAuthContext();
  // const mappedTeams = tenants.map((tenant) => ({
  //   name: tenant.name,
  //   logo: GalleryVerticalEnd,
  //   plan: "Active", 
  // }));


  // console.log("tenants from context:", tenants);
  // console.log("mappedTeams", mappedTeams);


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
