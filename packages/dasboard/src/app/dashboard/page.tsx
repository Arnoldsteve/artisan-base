"use client";

import { useDashboardData } from "@/hooks/use-dashboard-data";
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
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DollarSign, Users, ShoppingBag, Package } from "lucide-react";
import { Decimal } from "decimal.js"; // Import Decimal for formatting

// A dedicated skeleton component for a better loading experience
const DashboardSkeleton = () => (
  <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    <div className="h-24 bg-muted rounded-lg animate-pulse"></div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="h-80 lg:col-span-4 bg-muted rounded-lg animate-pulse"></div>
      <div className="h-80 lg:col-span-3 bg-muted rounded-lg animate-pulse"></div>
    </div>
  </div>
);

/**
 * The main dashboard page component.
 * It uses the `useDashboardData` hook to fetch and display store metrics.
 */
export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardData();

  // Helper to format Decimal values into currency strings
  const formatCurrency = (amount: Decimal | number) => {
    const num = amount instanceof Decimal ? amount.toNumber() : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Or your desired currency
    }).format(num);
  };

  // --- Render Logic ---
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <p className="text-sm">{error.message || "Failed to load dashboard data."}</p>
      </div>
    );
  }

  // Once data is successfully loaded
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.kpis.totalRevenue)}
            </div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{formatCurrency(data.kpis.sales)}
            </div>
            {/* <p className="text-xs text-muted-foreground">+18.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.kpis.newCustomers}</div>
            {/* <p className="text-xs text-muted-foreground">+3.2% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {data.kpis.inactiveProducts} Inactive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.sales}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Bar dataKey="total" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Your {data.recentOrders.length} most recent sales.
            </CardDescription>
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
                {data.recentOrders.map((order) => (
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
                          <p className="font-medium">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === "PENDING" ? "outline" : "default"}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}