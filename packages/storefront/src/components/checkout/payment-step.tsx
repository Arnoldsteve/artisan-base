"use client";

import React from "react";
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
import { ArrowLeft, ArrowRight, CreditCard, Wallet, Landmark, ShieldCheck, ExternalLink } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

export const PaymentStep: React.FC = () => {
  const { selectedPaymentMethod, setPaymentMethod, nextStep, previousStep, customer } = useCheckoutContext();
  const { tenant } = useTenantContext();

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
      method: selectedPaymentMethod?.id || (isKES ? "mpesa" : "credit_card"),
      mpesaPhone: customer?.phone?.replace("+254", "") || "",
      cardName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
    },
  });

  const selectedMethodId = watch("method");

  const onSubmit = (data: any) => {
    const fullMethodObject = paymentMethods.find((m) => m.id === data.method);
    
    if (fullMethodObject) {
      setPaymentMethod({
        ...fullMethodObject,
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
      // ✅ ADDED: PayPal Icon logic
      case "paypal": return <div className="text-blue-800 font-black italic text-[10px]">PP</div>;
      default: return <Landmark className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Payment Method</h2>
        <p className="text-sm text-muted-foreground">Select your preferred payment gateway.</p>
      </div>

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
              <div className="p-2 bg-background rounded-full border shadow-sm flex items-center justify-center size-8">
                {getIcon(method.id)}
              </div>
              <div className="grid gap-0.5">
                <span className="font-bold text-sm">{method.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                   {method.provider === 'MPESA' ? 'Mobile Money' : 'Express Checkout'}
                </span>
              </div>
            </div>
            {selectedMethodId === method.id && (
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Label>
        ))}
      </RadioGroup>

      <div className="bg-muted/30 p-6 rounded-sm border border-dashed border-muted-foreground/20 min-h-[140px] flex flex-col justify-center">
        {selectedMethodId === "credit_card" && (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <RequiredLabel>Name on Card</RequiredLabel>
              <Input {...register("cardName")} placeholder="Arnold Saka" className="h-11 bg-background" />
            </div>
            {/* Card fields... */}
          </div>
        )}

        {selectedMethodId === "mpesa" && (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <RequiredLabel>M-Pesa Number</RequiredLabel>
              <div className="flex gap-2">
                <div className="h-11 px-3 flex items-center bg-background border rounded-sm font-bold text-sm text-muted-foreground">+254</div>
                <Input {...register("mpesaPhone")} placeholder="712345678" className="h-11 bg-background flex-1" />
              </div>
            </div>
          </div>
        )}

        {/* ✅ NEW: PayPal Info Block */}
        {selectedMethodId === "paypal" && (
          <div className="flex flex-col items-center text-center space-y-3 py-2">
            <div className="p-3 bg-blue-50 rounded-full">
              <ExternalLink className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Secure Redirect</p>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                After clicking "Review Order", you will be redirected to PayPal's official site to complete your payment securely.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 bg-green-50/50 border border-green-100 rounded-sm">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <p className="text-[11px] text-green-800 leading-tight">
          Your payment is secured by 256-bit encryption. <br />
          <span className="font-bold">None of your sensitive data is stored on our servers.</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t">
        <Button variant="ghost" type="button" onClick={previousStep} className="w-full sm:w-auto text-muted-foreground font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shipping
        </Button>
        <Button type="submit" className="w-full sm:w-auto min-w-[180px] bg-blue-600 hover:bg-blue-700 h-12 font-bold uppercase tracking-widest">
          Review Order
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};