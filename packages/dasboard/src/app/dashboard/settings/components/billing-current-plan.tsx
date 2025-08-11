"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@repo/ui";
import { Button, Badge } from "@repo/ui"; // Make sure Spinner is imported
import { Subscription } from "@/types/billing";

// --- THIS IS THE FIX ---
// Import the new, specific hook for fetching the subscription
import { useBillingSubscription } from "@/hooks/use-billing";

interface BillingCurrentPlanProps {
  subscription?: Subscription | null;
}

export function BillingCurrentPlan({
  subscription: propSubscription,
}: BillingCurrentPlanProps) {
  // Call the correct hook: useBillingSubscription
  const {
    data: hookSubscription,
    isLoading,
    error,
  } = useBillingSubscription(propSubscription);

  // Prioritize the server-provided prop, then the hook's state
  const sub = propSubscription === null ? null : (propSubscription || hookSubscription);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-20">
          {/* <Spinner /> */}loading ...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription className="text-destructive">
            {error.message || "Could not load subscription details."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!sub) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are not subscribed to any plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please choose a plan to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const { plan, status, currentPeriodEnd } = sub;

  const handleManageBilling = () => {
    alert("Redirecting to billing portal...");
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(currentPeriodEnd));

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(plan.price);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              {status === "ACTIVE"
                ? `Your plan renews on ${formattedDate}.`
                : "Your plan is currently inactive."}
            </CardDescription>
          </div>
          <Badge
            variant={status === "ACTIVE" ? "default" : "destructive"}
            className="capitalize"
          >
            {status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{plan.name}</span>
          <span className="text-muted-foreground">
            {price} / {plan.billingCycle === "MONTHLY" ? "mo" : "yr"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleManageBilling}>Manage Billing</Button>
      </CardFooter>
    </Card>
  );
}