import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { CheckCircle, MapPin, Truck, CreditCard, Edit2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useCheckoutContext } from "@/contexts/checkout-context";

export const OrderReviewStep = () => {
    const { customer, shippingAddress, selectedShippingOption, selectedPaymentMethod, previousStep, submitOrder, isLoading } = useCheckoutContext();
  const { items } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 100 ? 0 : selectedShippingOption?.price || 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">Review Your Order</h1>
      </div>

        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Customer Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Customer Information
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{customer?.firstName} {customer?.lastName}</p>
                <p className="text-sm text-muted-foreground">{customer?.email}</p>
                <p className="text-sm text-muted-foreground">{customer?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Shipping Address
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{shippingAddress?.street}</p>
                <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}</p>
                <p>{shippingAddress?.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Payment */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping Method
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedShippingOption?.name}</span>
                    {shippingCost === 0 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        FREE
                      </Badge>
                    ) : (
                      <span className="font-medium">${shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedShippingOption?.description} ({selectedShippingOption?.estimatedDays})
                  </p>
                  {shippingCost === 0 && (
                    <p className="text-xs text-green-600">
                      Free shipping on orders over $100
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Method
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PP</span>
                  </div>
                  <span>{selectedPaymentMethod?.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
};