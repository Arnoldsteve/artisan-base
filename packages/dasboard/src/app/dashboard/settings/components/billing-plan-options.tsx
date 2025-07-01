'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui";
import { Button } from "@repo/ui";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Plan = { 
  id: string; 
  name: string; 
  price: number; 
  billingCycle: 'MONTHLY' | 'YEARLY'; 
  features: string[];
};

interface BillingPlanOptionsProps {
  availablePlans: Plan[];
  currentPlanId: string;
}

export function BillingPlanOptions({ availablePlans, currentPlanId }: BillingPlanOptionsProps) {

  const handleSelectPlan = (planId: string) => {
    // Mock API call to change plan
    toast.promise(new Promise(res => setTimeout(res, 1000)), {
      loading: 'Updating your plan...',
      success: 'Your plan has been updated successfully!',
      error: 'Failed to update plan.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Your Plan</CardTitle>
        <CardDescription>Choose the plan that best fits your needs.</CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-6">
        {availablePlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plan.price)}
                </span>
                <span className="text-muted-foreground">/ {plan.billingCycle === 'MONTHLY' ? 'mo' : 'yr'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              {currentPlanId === plan.id ? (
                <Button disabled className="w-full">Current Plan</Button>
              ) : (
                <Button onClick={() => handleSelectPlan(plan.id)} className="w-full">
                  {plan.price > 0 ? "Upgrade" : "Switch Plan"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}