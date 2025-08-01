"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Avatar, AvatarFallback } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DollarSign, Users, ShoppingBag, Package } from "lucide-react";
import { useDashboardKpis, useRecentOrders } from "@/hooks/use-dashboard"; 
import { formatCurrency } from "@/utils/format-currency"; // Assuming you have a currency formatter util
import { Skeleton } from "@repo/ui"; // Import a skeleton component for loading states

// --- Reusable Skeleton Components for a Better Loading Experience ---

const KpiCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-2/5" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-3/5" />
      <Skeleton className="h-3 w-4/5 mt-2" />
    </CardContent>
  </Card>
);

const RecentOrdersSkeleton = () => (
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>Loading recent sales...</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <Skeleton className="ml-auto h-5 w-[60px]" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// --- Main Dashboard Page Component ---

export default function DashboardPage() {
  // Use the separate hooks to fetch data in parallel
  const { data: kpis, isLoading: kpisLoading, isError: kpisIsError } = useDashboardKpis();
  const { data: ordersData, isLoading: ordersLoading, isError: ordersIsError } = useRecentOrders();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* KPI Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpisLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : kpisIsError ? (
          <p className="col-span-4 text-destructive">Failed to load stats.</p>
        ) : kpis ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{formatCurrency(kpis.salesToday)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{kpis.totalCustomers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.activeProducts}</div>
                <p className="text-xs text-muted-foreground">{kpis.inactiveProducts} Inactive</p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Sales chart can be implemented here later */}
            <div className="h-[350px] w-full flex items-center justify-center bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Sales chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        {ordersLoading ? (
            <RecentOrdersSkeleton />
        ) : ordersIsError ? (
            <Card className="lg:col-span-3"><CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader><CardContent><p className="text-destructive">Failed to load orders.</p></CardContent></Card>
        ) : ordersData ? (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your {ordersData.recentOrders.length} most recent sales.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {order.customer?.firstName?.[0]}
                              {order.customer?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <p className="font-medium truncate">{order.customer?.firstName} {order.customer?.lastName}</p>
                            <p className="text-sm text-muted-foreground truncate">{order.customer?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === "PENDING" ? "outline" : "default"}>{order.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}