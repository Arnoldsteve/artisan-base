import { Home, Package, ShoppingCart, Users, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui";

// Menu items.

const items = [
  {
    title: "Home",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    url: "dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    url: "dashboard/products",
    icon: Package,
  },
  {
    title: "Customers",
    url: "dashboard/customers",
    icon: Users,
  },
  {
    title: "Settings",
    url: "dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="group flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-primary [&>svg]:transition-colors [&>svg]:text-sidebar-foreground group-hover:[&>svg]:text-sidebar-primary"
                      aria-current={
                        window.location.pathname === `/${item.url}`
                          ? "page"
                          : undefined
                      }
                    >
                      <item.icon className="size-5 mr-2" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
