"use client";

import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { SubscriptionPlan, BillingCycle } from "@/types/billing";
import { useBilling } from "@/hooks/use-billing";
import { SmartphoneIcon } from "lucide-react";

interface MpesaSubscribeModalProps {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MpesaSubscribeModal({ plan, isOpen, onClose }: MpesaSubscribeModalProps) {
  const [phone, setPhone] = useState("");
  const { subscribe, isSubscribing } = useBilling();

  const handleMpesaPay = () => {
    if (!plan) return;
    
    subscribe({
      planId: plan.id,
      billingCycle: BillingCycle.MONTHLY,
      phone: phone, // e.g., 254712345678
    }, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto bg-green-100 text-green-600 p-3 rounded-full w-fit mb-4">
            <SmartphoneIcon className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Subscribe via M-Pesa</DialogTitle>
          <DialogDescription className="text-center">
            You are subscribing to the <strong>{plan?.name}</strong> plan for 
            <strong> KES {Number(plan?.price).toLocaleString()}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">M-Pesa Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g. 254712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubscribing}
            />
            <p className="text-[10px] text-muted-foreground">
              Ensure your phone is unlocked. You will receive an STK Push to enter your PIN.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubscribing}>Cancel</Button>
          <Button 
            className="bg-[#2EB400] hover:bg-[#259100] text-white" 
            onClick={handleMpesaPay}
            disabled={isSubscribing || phone.length < 10}
          >
            {isSubscribing ? "Sending STK..." : "Pay with M-Pesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}