"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { TenantSubscription, SubscriptionStatus } from "@/types/billing";
import { CalendarIcon, CreditCardIcon, AlertTriangleIcon } from "lucide-react";
import { useBilling } from "@/hooks/use-billing";

interface CurrentPlanCardProps {
  subscription: TenantSubscription;
  isKenya: boolean;
}

export function CurrentPlanCard({ subscription, isKenya }: CurrentPlanCardProps) {
  const { cancel, isCancelling } = useBilling();

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return "bg-green-500/10 text-green-600 border-green-200";
      case SubscriptionStatus.PAST_DUE:
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case SubscriptionStatus.CANCELED:
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <Card className="rounded-sm shadow-sm bg-white border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">Current Subscription</CardTitle>
            <CardDescription>You are currently on the {subscription.plan?.name} plan.</CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCardIcon className="h-5 w-5" />
          </div>
          <div className="grid gap-0.5">
            <p className="font-medium">Plan Pricing</p>
            <p className="text-muted-foreground">
              {isKenya ? "KES" : "$"}{subscription.plan?.price.toLocaleString()} / {subscription.plan?.billingCycle.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div className="grid gap-0.5">
            <p className="font-medium">
              {subscription.status === SubscriptionStatus.CANCELED ? "Access Ends On" : "Next Billing Date"}
            </p>
            <p className="text-muted-foreground">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                dateStyle: 'long'
              })}
            </p>
          </div>
        </div>

        {subscription.status === SubscriptionStatus.PAST_DUE && (
          <div className="flex items-center gap-3 p-3 rounded-md bg-amber-50 border border-amber-100 text-amber-700 text-xs">
            <AlertTriangleIcon className="h-4 w-4 shrink-0" />
            <p>Your last payment failed. Please update your payment method to avoid store suspension.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/5 px-6 py-4 flex justify-end gap-3">
        {subscription.status !== SubscriptionStatus.CANCELED && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => cancel(false)} // Cancels at period end
            disabled={isCancelling}
          >
            {isCancelling ? "Processing..." : "Cancel Subscription"}
          </Button>
        )}
        <Button variant="outline" size="sm">
          View Billing History
        </Button>
      </CardFooter>
    </Card>
  );
}