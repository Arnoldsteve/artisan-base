"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Mail,
  Download,
  ArrowRight,
  Store,
  Receipt,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { formatMoney } from "@/lib/money";

/**
 * SOLID Principle: Single Responsibility
 * This component handles the 'Post-Purchase' state, providing 
 * clear tracking info for multi-vendor marketplace orders.
 */
export const OrderConfirmationStep = () => {
  // In our refactored context, 'order' contains the OrderResponse (orderIds, ref)
  const { order, resetCheckout, customer } = useCheckoutContext();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    // millions of users: We do not clear the context immediately on mount 
    // to ensure the user can read the order numbers if they refresh.
  }, []);

  if (!mounted) return null;

  if (!order) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-700">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Receipt className="text-muted-foreground h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold">No recent order found</h2>
        <p className="text-muted-foreground mt-2">Browse our marketplace for unique handcrafted items.</p>
        <Button asChild className="mt-6 bg-blue-600">
          <Link href="/products">Discover Products</Link>
        </Button>
      </div>
    );
  }

  // Handle both single string and array of IDs for multi-vendor support
  const orderIds = Array.isArray(order.orderIds) ? order.orderIds : [order.id || "N/A"];

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4 animate-in slide-in-from-bottom-8 fade-in duration-1000">
      {/* 1. Success Celebration */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-50 p-4 border border-green-100 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            ORDER CONFIRMED
          </h1>
          <p className="text-muted-foreground font-medium">
            Thank you, {customer?.firstName}. Your artisan goods are being prepared.
          </p>
        </div>
      </div>

      {/* 2. Order Numbers Card (Marketplace Scale) */}
      <div className="bg-muted/30 border border-dashed border-muted-foreground/30 rounded-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Transaction Reference
            </p>
            <p className="font-mono text-sm font-bold uppercase">
              {order.paymentReference || "TXN-PENDING"}
            </p>
          </div>
          <div className="h-px w-full md:w-px md:h-10 bg-border" />
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Store Order {orderIds.length > 1 ? "Numbers" : "Number"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {orderIds.map((id: string) => (
                <span key={id} className="bg-white border px-2 py-0.5 rounded text-[11px] font-bold shadow-sm">
                  #{id.slice(-8).toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Communication Notice */}
      <div className="flex gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-sm">
        <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900">Check your inbox</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            We've sent a detailed receipt and tracking links to <span className="font-bold underline">{customer?.email}</span>. 
            If you paid via M-Pesa, your status will update within 2 minutes.
          </p>
        </div>
      </div>

      {/* 4. Tracking Timeline */}
      <div className="space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Truck className="h-4 w-4" /> Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
                title: "Processing", 
                desc: "Artisans verify stock & pack", 
                time: "1-2 Days",
                icon: <Package className="h-4 w-4" />
            },
            { 
                title: "On the Move", 
                desc: "Handed over to our couriers", 
                time: "3-5 Days",
                icon: <Truck className="h-4 w-4" />
            },
            { 
                title: "At Your Door", 
                desc: "Delivery to your address", 
                time: "Final Arrival",
                icon: <MapPin className="h-4 w-4" />
            },
          ].map((step, i) => (
            <div key={i} className="relative flex md:flex-col items-start md:items-center gap-4 md:text-center">
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border font-bold text-xs">
                {step.icon}
               </div>
               <div className="space-y-1">
                 <p className="font-bold text-sm">{step.title}</p>
                 <p className="text-[11px] text-muted-foreground leading-tight">{step.desc}</p>
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{step.time}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Enterprise Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button
          variant="default"
          size="lg"
          className="flex-1 h-12 bg-blue-600 font-bold uppercase tracking-widest text-xs gap-2"
          onClick={() => {
            resetCheckout();
            window.location.href = '/products';
          }}
        >
          Explore More Treasures <ArrowRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="flex-1 h-12 font-bold uppercase tracking-widest text-xs border-blue-200 text-blue-700"
          onClick={() => window.print()}
        >
          <Download className="mr-2 h-4 w-4" /> Print Receipt
        </Button>
      </div>

      {/* 6. Marketplace Support Footer */}
      <div className="pt-10 border-t text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Need help with these specific items?
        </p>
        <div className="flex justify-center gap-6 text-[11px] font-bold uppercase text-blue-600">
           <Link href="/contact" className="hover:underline">Contact Platform</Link>
           <Link href="/faq" className="hover:underline">Shipping FAQ</Link>
        </div>
      </div>
    </div>
  );
};