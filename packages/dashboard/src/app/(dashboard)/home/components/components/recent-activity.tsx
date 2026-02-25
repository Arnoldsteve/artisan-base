"use client";

import React from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { 
  ArrowRight, 
  ShoppingCart, 
  Star, 
  User, 
  Clock 
} from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useReviews } from "@/hooks/use-reviews";
import { formatMoney } from "@/utils/money";
import { useAuthContext } from "@/contexts/auth-context";

/**
 * TOP 1% ARCHITECTURE: Aggregated Feed Component
 * millions of users: Reuses isolated domain hooks to provide a 
 * snapshot of recent store events.
 */
export function RecentActivity() {
  const { baseCurrency } = useAuthContext();

  // 1. Re-use existing hooks with a limit of 5 for the home page 'Preview'
  const { orders, isLoading: isLoadingOrders } = useOrders(5);
  const { reviews, isLoading: isLoadingReviews } = useReviews(5);

  const hasOrders = orders && orders.length > 0;
  const hasReviews = reviews && reviews.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* LEFT: Recent Orders */}
      <Card className="rounded-sm shadow-sm border-border bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              Latest Sales
            </CardTitle>
            <CardDescription className="text-[11px] uppercase tracking-tighter">
              The 5 most recent transactions
            </CardDescription>
          </div>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 uppercase">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!hasOrders && !isLoadingOrders ? (
            <div className="py-10 text-center text-muted-foreground text-sm italic border rounded-sm border-dashed">
              No orders yet.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="grid gap-0.5">
                      <p className="text-sm font-bold leading-none group-hover:text-blue-600 transition-colors">
                        {order.customer?.firstName} {order.customer?.lastName || 'Guest'}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono uppercase">
                        #{order.orderNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black tabular-nums">
                      {formatMoney(order.totalAmount, baseCurrency || "KES")}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RIGHT: Recent Reviews */}
      <Card className="rounded-sm shadow-sm border-border bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Customer Feedback
            </CardTitle>
            <CardDescription className="text-[11px] uppercase tracking-tighter">
              Newest product ratings
            </CardDescription>
          </div>
          <Link href="/reviews">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 uppercase">
              Moderate <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!hasReviews && !isLoadingReviews ? (
            <div className="py-10 text-center text-muted-foreground text-sm italic border rounded-sm border-dashed">
              No feedback received yet.
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted opacity-30"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-xs font-bold text-foreground">
                      {review.product?.name || "Handcrafted Item"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                      "{review.comment || 'No comment provided.'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}