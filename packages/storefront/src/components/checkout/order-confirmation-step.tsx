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
  const { clearCart } = useCart();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => clearCart(), []);
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

  const estimatedDelivery = formatDate(order.estimatedDelivery.toString());

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
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
          <p className="text-xl font-bold">#{order.id}</p>
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
            <span className="font-medium">{order.customer.email}</span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">What happens next?</h2>

        <div className="relative flex justify-between items-start">
          {/* Single connector line behind all steps */}
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
              {/* Icon */}
              <div
                className={`rounded-full p-3 mb-2 relative z-10 ${
                  step.active ? "bg-green-100" : "bg-gray-200"
                }`}
              >
                {step.icon}
              </div>

              {/* Title */}
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × {order.items.length} items
                </p>
              </div>
              <p className="font-medium">
                {formatMoney(item.price * item.quantity, "KES")}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />
        <div className="space-y-2">
          {[
            ["Subtotal", order.subtotal],
            ["Shipping", order.shippingCost],
            ...(order.tax > 0 ? [["Tax", order.tax]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span>{formatMoney(value, "KES")}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatMoney(order.total, "KES")}</span>
          </div>
        </div>
      </div>

      {/* Shipping + Contact */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            icon: <MapPin className="h-5 w-5" />,
            title: "Shipping Address",
            content: (
              <>
                <p className="font-medium text-foreground">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </>
            ),
          },
          {
            icon: <Phone className="h-5 w-5" />,
            title: "Contact Information",
            content: (
              <>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {order.customer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {order.customer.phone}
                </p>
              </>
            ),
          },
        ].map(({ icon, title, content }) => (
          <div key={title} className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              {icon}
              {title}
            </h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              {content}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          asChild
          size="lg"
          className="flex-1"
          onClick={handleContinueShopping}
        >
          <Link href="/products">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={handleContinueShopping}
        >
          <Link href={`/orders/${order.id}`}>View Order Details</Link>
        </Button>
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
