"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface KpiMetric {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  format?: "currency" | "number" | "percentage" | "days";
}

interface KpiSectionProps {
  title: string;
  metrics: KpiMetric[];
  onMetricClick?: (metric: string) => void;
  isLoading?: boolean;
}

export function KpiSection({ title, metrics, onMetricClick, isLoading }: KpiSectionProps) {
  const formatValue = (value: string | number, format?: string) => {
    if (typeof value === "number") {
      switch (format) {
        case "currency":
          return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        case "percentage":
          return `${value}%`;
        case "days":
          return `${value} days`;
        default:
          return new Intl.NumberFormat("en-KE").format(value);
      }
    }
    return value;
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold capitalize">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow",
              onMetricClick && "hover:border-primary"
            )}
            onClick={() => onMetricClick?.(metric.title)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              {metric.trend && getTrendIcon(metric.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(metric.value, metric.format)}
              </div>
              {metric.change !== undefined && (
                <p
                  className={cn(
                    "text-xs mt-1",
                    metric.change > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}% from last period
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}