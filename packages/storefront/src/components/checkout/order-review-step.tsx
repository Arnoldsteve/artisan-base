"use client";

import React, { useMemo } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  CheckCircle2,
  MapPin,
  Truck,
  CreditCard,
  Edit3,
  User,
  Store,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { formatMoney } from "@/lib/money";
import { Separator } from "@repo/ui/components/ui/separator";

export const OrderReviewStep = () => {
  const {
    customer,
    shippingAddress,
    selectedShippingOption,
    selectedPaymentMethod,
    goToStep,
  } = useCheckoutContext();
  const { items } = useCart();

  /**
   * TOP 1% LOGIC: Multi-Vendor Verification
   * Grouping items one last time so the customer understands
   * they are supporting specific artisans.
   */
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.tenantId]) {
        acc[item.tenantId] = { name: item.tenantName || "Artisan Store", items: [] };
      }
      acc[item.tenantId].items.push(item);
      return acc;
    }, {} as Record<string, { name: string; items: typeof items }>);
  }, [items]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      {/* 1. Trust Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-green-600">
          <PackageCheck className="h-6 w-6" />
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Final Review
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Please check your details before we process your marketplace order.
        </p>
      </div>

      <div className="grid gap-6">
        {/* 2. Multi-Vendor Item Summary */}
        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Order Items
            </CardTitle>
            <Button variant="link" size="sm" onClick={() => window.location.href = '/cart'} className="text-blue-600 h-auto p-0">
              Edit Bag
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(groupedItems).map(([tenantId, group]) => (
              <div key={tenantId} className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-blue-600 uppercase tracking-tight">
                  <Store className="h-3 w-3" />
                  Shipment from {group.name}
                </div>
                {group.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pl-5">
                    <span className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{item.quantity}x</span> {item.name}
                    </span>
                    <span className="text-sm font-mono font-bold">
                      {formatMoney(item.price * item.quantity, "KES")}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3. Personal & Logistics Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <Card className="rounded-sm border-2 border-transparent hover:border-blue-100 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Contact
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToStep(0)}>
                <Edit3 className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-bold">{customer?.firstName} {customer?.lastName}</p>
              <p className="text-muted-foreground">{customer?.email}</p>
              <p className="text-muted-foreground tabular-nums">{customer?.phone}</p>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="rounded-sm border-2 border-transparent hover:border-blue-100 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                Delivery
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToStep(1)}>
                <Edit3 className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="text-sm space-y-0.5">
              <p className="font-bold">{shippingAddress?.addressLine1}</p>
              {shippingAddress?.addressLine2 && <p className="text-muted-foreground">{shippingAddress.addressLine2}</p>}
              <p className="text-muted-foreground">
                {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}
              </p>
              <p className="font-medium text-xs text-foreground uppercase tracking-widest pt-1">
                {shippingAddress?.country}
              </p>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card className="rounded-sm border-2 border-transparent hover:border-blue-100 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Truck className="h-3.5 w-3.5" />
                Method
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToStep(1)}>
                <Edit3 className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="text-sm flex items-center justify-between">
              <div className="grid gap-0.5">
                <p className="font-bold">{selectedShippingOption?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{selectedShippingOption?.estimatedDays} delivery</p>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-100">
                {selectedShippingOption?.price === 0 ? 'FREE' : formatMoney(selectedShippingOption?.price || 0, "KES")}
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="rounded-sm border-2 border-transparent hover:border-blue-100 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                Payment
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToStep(2)}>
                <Edit3 className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center gap-2">
                <div className="h-6 w-10 bg-muted rounded-sm border flex items-center justify-center font-extrabold text-[10px] tracking-tighter">
                  {selectedPaymentMethod?.provider === 'MPESA' ? 'KES' : 'CARD'}
                </div>
                <p className="font-bold">{selectedPaymentMethod?.name}</p>
              </div>
              {selectedPaymentMethod?.provider === 'MPESA' && (
                <p className="text-[10px] text-green-600 font-bold uppercase mt-1">Prompting M-Pesa STK</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};