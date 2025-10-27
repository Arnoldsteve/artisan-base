"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Subscription } from "@/types/billing";

// Import the specific hook for fetching the subscription
import { useBillingSubscription } from "@/hooks/use-billing";

interface BillingCurrentPlanProps {
  subscription?: Subscription | null;
}

export function BillingCurrentPlan({
  subscription: initialSubscriptionData, // Rename for clarity
}: BillingCurrentPlanProps) {
  // --- THIS IS THE FIX ---
  // The hook becomes the single source of truth for the component's data.
  // - On initial render, `subscription` will be `initialSubscriptionData`.
  // - After a successful refetch (triggered by invalidateQueries),
  //   this hook will re-render the component and `subscription` will be the NEW data.
  const {
    data: subscription,
    isLoading,
    isError,
    error,
  } = useBillingSubscription(initialSubscriptionData);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="h-20 pt-4 text-muted-foreground">
          Loading subscription details...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription className="text-destructive">
            {error?.message || "Could not load subscription details."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // This `if` block now handles the state where there is definitively no subscription
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are not subscribed to any plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please choose a plan to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If we get past the checks above, we know we have a valid subscription object.
  const { plan, status, currentPeriodEnd } = subscription;

  const handleManageBilling = () => {
    alert(
      "This will redirect to the Stripe Customer Portal in a real application."
    );
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(currentPeriodEnd));

  // NOTE: Prisma Decimal is a string, so we must parse it to a number for formatting.
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(plan.price));

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
            {status.toLowerCase().replace("_", " ")}
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
