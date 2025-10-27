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
import { CheckCircle2, Loader2 } from "lucide-react";
import { Plan } from "@/types/billing";

import {
  useBillingPlans,
  useBillingSubscription,
  useChangePlan,
} from "@/hooks/use-billing";
import { formatMoney } from "@/utils/money";

interface BillingPlanOptionsProps {
  availablePlans?: Plan[];
  currentPlanId?: string | null;
}

// Helper function to generate feature text from the features object
const getFeatureText = (features: any): string[] => {
  if (!features) return [];
  const text = [];
  if (features.productLimit) {
    text.push(
      `${features.productLimit === "unlimited" ? "Unlimited" : features.productLimit} Products`
    );
  }
  if (features.teamMemberLimit) {
    text.push(
      `${features.teamMemberLimit === "unlimited" ? "Unlimited" : features.teamMemberLimit} Team Members`
    );
  }
  if (features.hasAnalytics) text.push("Advanced Analytics");
  if (features.hasCustomDomain) text.push("Custom Domain");
  if (features.prioritySupport) text.push("Priority Support");
  if (features.advancedReporting) text.push("Advanced Reporting");
  if (features.dedicatedAccountManager) text.push("Dedicated Account Manager");
  return text;
};

export function BillingPlanOptions({
  availablePlans: propPlans,
  currentPlanId: propCurrentPlanId,
}: BillingPlanOptionsProps) {
  const {
    data: plans,
    isLoading: isLoadingPlans,
    error: plansError,
  } = useBillingPlans(propPlans);

  const { data: subscription } = useBillingSubscription();
  const { mutate: changePlan, isPending, variables } = useChangePlan();

  const currentPlanId =
    propCurrentPlanId === null
      ? null
      : propCurrentPlanId || subscription?.plan.id;

  if (isLoadingPlans) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="h-40 pt-4 text-muted-foreground">
          Loading available plans...
        </CardContent>
      </Card>
    );
  }

  if (plansError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription className="text-destructive">
            Could not load subscription plans.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Your Plan</CardTitle>
        <CardDescription>
          Choose the plan that best fits your needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(plans || []).map((plan) => {
          const featureList = getFeatureText(plan.features);
          const isThisPlanPending = isPending && variables === plan.id;

          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {formatMoney(plan.price)}
                  </span>
                  <span className="text-muted-foreground">/ mo</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {featureList.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {currentPlanId === plan.id ? (
                  <Button disabled variant="outline" className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => changePlan(plan.id)}
                    className="w-full"
                    disabled={isPending}
                  >
                    {isThisPlanPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isThisPlanPending ? "Switching..." : "Switch Plan"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
