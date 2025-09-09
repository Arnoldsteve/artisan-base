"use client"

import * as React from "react"
import {
  AudioWaveform,
  Package ,
  ShoppingCart ,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard ,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui"

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
      icon: LayoutDashboard ,
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
      icon: ShoppingCart ,
      items: [
        {
          title: "All Orders",
          url: "/orders",
        },
        {
          title: "Paid Orders",
          url: "paid-orders",
        },
        {
          title: "Parially Paid Orders",
          url: "partially-paid-orders",
        },
        {
          title: "Unpaid Orders",
          url: "#",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: Package ,
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Active Products",
          url: "acitve-products",
        },
        {
          title: "Inactive Products",
          url: "inactive-products",
        },
        {
          title: "Products Categories",
          url: "product-categories",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General", // contain the storename, address, currency, etc
          url: "/settings",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
