"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  Download,
  ArrowRight,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { useCheckoutContext } from "@/contexts/checkout-context";
import { useCart } from "@/hooks/use-cart";
import { formatMoney } from "@/lib/money";
import { formatDate } from "@/utils/date";

export const OrderConfirmationStep = () => {
  const { order, resetCheckout } = useCheckoutContext();
  const [mounted, setMounted] = React.useState(false);

  console.log("created order in the confirmayion", order)
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!order)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No order found.</p>
        <Button asChild className="mt-4">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );

  const handleContinueShopping = () => resetCheckout();

  const estimatedDelivery = order.estimatedDelivery
    ? formatDate(order.estimatedDelivery)
    : "TBD";

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-2">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase
        </p>
        <div className="inline-block bg-muted px-6 py-3 rounded-lg">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-xl font-bold">#{order.orderNumber ?? "N/A"}</p>
        </div>
      </div>

      <Separator />

      {/* Email Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Confirmation email sent</p>
          <p className="text-sm text-blue-700">
            We've sent a confirmation to{" "}
            <span className="font-medium">
              {order.customer?.email ?? "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">What happens next?</h2>

        <div className="relative flex justify-between items-start">
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-300 -z-10" />

          {[
            {
              icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
              title: "Order Placed",
              subtitle: "Just now",
              active: true,
            },
            {
              icon: <Package className="h-5 w-5 text-gray-600" />,
              title: "Processing",
              subtitle: "Within 24 hours",
            },
            {
              icon: <Truck className="h-5 w-5 text-gray-600" />,
              title: "Shipped",
              subtitle: "2–3 business days",
            },
            {
              icon: <MapPin className="h-5 w-5 text-gray-600" />,
              title: "Delivered",
              subtitle: `Est. ${estimatedDelivery}`,
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 text-center"
            >
              <div
                className={`rounded-full p-3 mb-2 relative z-10 ${
                  step.active ? "bg-green-100" : "bg-gray-200"
                }`}
              >
                {step.icon}
              </div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild size="lg" onClick={handleContinueShopping}>
          <Link href="/products">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {/* <Button asChild variant="outline" size="lg" onClick={handleContinueShopping}>
          <Link href={`/orders/${order.id}`}>View Order Details</Link>
        </Button> */}
        <Button variant="outline" size="lg" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>

      {/* Support */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-2">
          Need help with your order?
        </p>
        <Button asChild variant="link" onClick={handleContinueShopping}>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
};
