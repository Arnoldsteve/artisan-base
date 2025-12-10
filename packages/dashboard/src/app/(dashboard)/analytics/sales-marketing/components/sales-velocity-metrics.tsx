"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { TrendingUp, Calendar, Clock, Target } from "lucide-react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

interface SalesVelocityMetricsProps {
  filters: {
    period: string;
    category: string;
    location: string;
    paymentMethod: string;
  };
}

export function SalesVelocityMetrics({ filters }: SalesVelocityMetricsProps) {
  // TODO: Fetch real data using filters
  const isLoading = false;

  const metrics = [
    {
      title: "Daily Average Sales",
      icon: TrendingUp,
      revenue: "KSh 45,230",
      orders: "23 orders/day",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Peak Shopping Day",
      icon: Calendar,
      revenue: "Friday",
      orders: "35% of weekly sales",
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Peak Shopping Hour",
      icon: Clock,
      revenue: "2:00 PM - 3:00 PM",
      orders: "18% of daily sales",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Conversion Rate",
      icon: Target,
      revenue: "3.2%",
      orders: "↑ 0.8% from last period",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.revenue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.orders}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}