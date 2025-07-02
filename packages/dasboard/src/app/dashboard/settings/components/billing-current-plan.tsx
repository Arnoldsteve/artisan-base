"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@repo/ui";
import { Button, Badge } from "@repo/ui";
import { useBilling } from "@/hooks/use-billing";
import { Subscription } from "@/types/billing";

// These types would typically be in a shared types file
type Plan = {
  id: string;
  name: string;
  price: number;
  billingCycle: "MONTHLY" | "YEARLY";
};
type Subscription = {
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE";
  currentPeriodEnd: Date;
  plan: Plan;
};

interface BillingCurrentPlanProps {
  subscription?: Subscription;
}

export function BillingCurrentPlan({
  subscription: propSubscription,
}: BillingCurrentPlanProps) {
  const { subscription, loading, error } = useBilling();
  const sub = propSubscription || subscription;
  if (loading) return <div>Loading current plan...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!sub) return null;
  const { plan, status, currentPeriodEnd } = sub;
  const handleManageBilling = () => {
    // In a real app, this would redirect to your Stripe Customer Portal
    // window.location.href = 'https://billing.stripe.com/p/...'
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
