"use client";

import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { CheckIcon, ZapIcon } from "lucide-react";
import { SubscriptionPlan, BillingCycle } from "@/types/billing";
import { useBilling } from "@/hooks/use-billing";
import { MpesaSubscribeModal } from "./mpesa-subscribe-modal";

interface PricingTableProps {
  plans: SubscriptionPlan[];
  currentPlanId?: string;
  isKenya: boolean;
}

export function PricingTable({ plans, currentPlanId, isKenya }: PricingTableProps) {
  const { subscribe, isSubscribing } = useBilling();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handlePlanSelection = (plan: SubscriptionPlan) => {
    if (isKenya) {
      // For Kenya, we need to collect a phone number first
      setSelectedPlan(plan);
    } else {
      // For Global, trigger direct Stripe checkout redirect
      subscribe({
        planId: plan.id,
        billingCycle: BillingCycle.MONTHLY,
        stripePriceId: plan.providerPlanId,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        const isPro = plan.name.toLowerCase().includes("pro");

        return (
          <Card 
            key={plan.id} 
            className={`flex flex-col rounded-sm shadow-sm transition-all ${
              isPro ? "border-primary border-2 shadow-md relative" : "border-border"
            }`}
          >
            {isPro && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl font-bold">
                  {isKenya ? "KES" : "$"}{Number(plan.price).toLocaleString()}
                </span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <CardDescription>
                Everything you need to grow your {plan.name.toLowerCase()} business.
              </CardDescription>
              
              <ul className="space-y-2 text-sm">
                {/* 
                  TOP 1% LOGIC: 
                  We map the JSON 'features' from your Prisma schema directly to UI 
                */}
                {Object.entries(plan.features).map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{String(value)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-4">
              <Button 
                className="w-full" 
                variant={isPro ? "default" : "outline"}
                disabled={isCurrent || isSubscribing}
                onClick={() => handlePlanSelection(plan)}
              >
                {isCurrent ? "Current Plan" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}

      {/* Modal for M-Pesa phone number collection */}
      <MpesaSubscribeModal 
        plan={selectedPlan}
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  );
}