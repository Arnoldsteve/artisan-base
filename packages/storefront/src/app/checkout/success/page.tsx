"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { CheckCircle, Package, Mail, ArrowRight, Home, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  // Mock order details - in a real app this would come from the checkout process
  const orderDetails = {
    orderNumber: "ORD-2024-001",
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    total: 151.17,
    items: [
      { name: "Handcrafted Ceramic Mug", quantity: 2, price: 24.99 },
      { name: "Wooden Cutting Board", quantity: 1, price: 89.99 },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground">
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Order #{orderDetails.orderNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{orderDetails.orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
              <div className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Here's what you can expect in the coming days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Order Confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation with your order details and tracking information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team will carefully prepare your handcrafted items for shipping.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <Button variant="outline" className="w-full sm:w-auto">
              <Package className="h-4 w-4 mr-2" />
              View Order Status
            </Button>
          </Link>
          <Link href="/products">
            <Button className="w-full sm:w-auto">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2 mx-auto">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 