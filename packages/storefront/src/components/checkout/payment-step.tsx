"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { useTenantContext } from "@/contexts/tenant-context";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { paymentSchema } from "@/validation-schemas/payment-schema";
import { paymentMethods } from "@/utils/payment-methods";
import { RequiredLabel } from "../RequiredLabel";
import { ArrowLeft, ArrowRight, CreditCard, Wallet, Landmark, ShieldCheck } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

export const PaymentStep: React.FC = () => {
  const { selectedPaymentMethod, setPaymentMethod, nextStep, previousStep, customer } = useCheckoutContext();
  const { tenant } = useTenantContext();

  // Identify regional context
  const isKES = tenant?.baseCurrency === "KES" || !tenant;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      // Logic: Default to M-Pesa if in Kenya, otherwise Credit Card
      method: selectedPaymentMethod?.id || (isKES ? "mpesa" : "credit_card"),
      // Prefill M-Pesa phone from customer info if available (UX optimization)
      mpesaPhone: customer?.phone?.replace("+254", "") || "",
      cardName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
    },
  });

  const selectedMethodId = watch("method");

  /**
   * TOP 1% LOGIC: Secure Identity Handover
   * When moving to the next step, we find the full method object 
   * from our utility. This ensures the 'provider' key (MPESA, STRIPE) 
   * is present for the final submission.
   */
  const onSubmit = (data: any) => {
    const fullMethodObject = paymentMethods.find((m) => m.id === data.method);
    
    if (fullMethodObject) {
      // This solves the 'toUpperCase' crash by ensuring provider is never undefined
      setPaymentMethod({
        ...fullMethodObject,
        // We can attach form-specific data to the object if needed
        metadata: {
          phone: data.mpesaPhone,
          cardName: data.cardName
        }
      });
      nextStep();
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "mpesa": return <Wallet className="h-4 w-4 text-green-600" />;
      case "credit_card": return <CreditCard className="h-4 w-4 text-blue-600" />;
      default: return <Landmark className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Payment Method</h2>
        <p className="text-sm text-muted-foreground">How would you like to pay for your handcrafted items?</p>
      </div>

      {/* <PaymentWarning /> */}

      {/* 1. Method Selection Cards */}
      <RadioGroup
        value={selectedMethodId}
        onValueChange={(val) => setValue("method", val)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {paymentMethods.map((method) => (
          <Label
            key={method.id}
            htmlFor={method.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-sm border-2 cursor-pointer transition-all hover:bg-muted/50",
              selectedMethodId === method.id ? "border-blue-600 bg-blue-50/30" : "border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
              <div className="p-2 bg-background rounded-full border shadow-sm">
                {getIcon(method.id)}
              </div>
              <div className="grid gap-0.5">
                <span className="font-bold text-sm">{method.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                   {method.provider === 'MPESA' ? 'Instant Mobile Money' : 'Secure Online Payment'}
                </span>
              </div>
            </div>
            {selectedMethodId === method.id && (
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Label>
        ))}
      </RadioGroup>

      {/* 2. Context-Specific Inputs */}
      <div className="bg-muted/30 p-6 rounded-sm border border-dashed border-muted-foreground/20">
        {selectedMethodId === "credit_card" && (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <RequiredLabel>Name on Card</RequiredLabel>
              <Input {...register("cardName")} placeholder="Arnold Saka" className="h-11 bg-background" />
              {errors.cardName && <p className="text-red-500 text-xs">{errors.cardName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <RequiredLabel>Card Number</RequiredLabel>
              <div className="relative">
                <Input {...register("cardNumber")} placeholder="0000 0000 0000 0000" className="h-11 bg-background pr-10" />
                <CreditCard className="absolute right-3 top-3 h-5 w-5 text-muted-foreground/30" />
              </div>
            </div>
          </div>
        )}

        {selectedMethodId === "mpesa" && (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <RequiredLabel>M-Pesa Registered Number</RequiredLabel>
              <div className="flex gap-2">
                <div className="h-11 px-3 flex items-center bg-background border rounded-sm font-bold text-sm text-muted-foreground">
                  +254
                </div>
                <Input
                  {...register("mpesaPhone")}
                  placeholder="712345678"
                  className="h-11 bg-background flex-1 font-mono"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                A secure STK Push request will be sent to this number.
              </p>
              {errors.mpesaPhone && <p className="text-red-500 text-xs">{errors.mpesaPhone.message as string}</p>}
            </div>
          </div>
        )}
      </div>

      {/* 3. Security Assurance */}
      <div className="flex items-center gap-3 p-4 bg-green-50/50 border border-green-100 rounded-sm">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <div className="text-[11px] text-green-800 leading-tight">
          <p className="font-bold">Encrypted Checkout</p>
          <p>Your details are protected with 256-bit SSL encryption and processed via {selectedMethodId === 'mpesa' ? 'Safaricom' : 'Stripe'}.</p>
        </div>
      </div>

      {/* 4. Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t">
        <Button
          variant="ghost"
          type="button"
          onClick={previousStep}
          className="w-full sm:w-auto text-muted-foreground font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shipping
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 h-12 font-bold uppercase tracking-widest"
        >
          Review Order
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};