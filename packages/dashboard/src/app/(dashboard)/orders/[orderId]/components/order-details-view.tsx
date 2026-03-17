"use client";

import React from "react";
import { useOrder, useOrders } from "@/hooks/use-orders";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { 
  Package, 
  Truck, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { formatMoney } from "@/utils/money";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { DataTableSkeleton } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";

interface OrderDetailsViewProps {
  orderId: string;
}

export function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  // 1. Data Fetching (Scoped by tenantId automatically)
  const { data: order, isLoading, isError } = useOrder(orderId);
  const { updateStatus, isUpdatingStatus } = useOrders();

  if (isLoading) return <DataTableSkeleton />;
  if (isError || !order) return <div className="p-10 text-center text-muted-foreground">Order session expired or not found.</div>;

  const shippingAddress = order.shippingAddress;

  return (
    <>
      {/* 
        TOP 1% ARCHITECTURE: Standardized Page Header 
        This restores the 'top bar' feel and provides consistent navigation.
      */}
      <PageHeader 
        title={`Order ${order.orderNumber}`}
        // description={`Placed on ${formatDate(order.createdAt)}`}
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 uppercase text-[10px] font-black px-3 py-1">
            {order.status}
          </Badge>
          
          {order.status === 'PENDING' && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[10px] tracking-widest h-8"
              onClick={() => updateStatus({ id: order.id, status: 'PROCESSING' })}
              disabled={isUpdatingStatus}
            >
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Start Packing
            </Button>
          )}
          
          <Link href="/orders">
            <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold">
              <ChevronLeft className="mr-1 h-3 w-3" /> Back
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="p-2 md:p-4 lg:p-6 space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: The Payload (Items & Totals) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-sm border-border shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b bg-muted/20 py-4">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Package Contents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-sm border bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase text-[10px]">
                          IMG
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">{item.productName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
                            SKU: {item.sku || 'UNTRACKED'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black tabular-nums">
                          {formatMoney(Number(item.unitPrice) * item.quantity, order.currency)}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">
                          {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary Block */}
                <div className="p-6 bg-muted/20 border-t space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground uppercase">Subtotal</span>
                    <span className="tabular-nums">{formatMoney(order.subtotal, order.currency)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground uppercase">Logistics (Shipping)</span>
                    <span className="tabular-nums">{formatMoney(order.shippingAmount, order.currency)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground uppercase">Estimated VAT</span>
                    <span className="tabular-nums">{formatMoney(order.taxAmount, order.currency)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-black text-xs uppercase tracking-widest text-foreground">Total Revenue</span>
                    <span className="text-2xl font-black tabular-nums text-blue-600">
                      {formatMoney(order.totalAmount, order.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Logistics & Metadata */}
          <div className="space-y-6">
            {/* Customer Contact Card */}
            <Card className="rounded-sm border-border shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  Buyer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <p className="font-bold text-base leading-tight">{order.customer?.firstName} {order.customer?.lastName}</p>
                  <p className="text-blue-600 text-xs font-medium">{order.customer?.email}</p>
                </div>
                <div className="pt-2 border-t border-dashed">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Direct Line</p>
                  <p className="tabular-nums font-bold text-foreground">{order.customer?.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Destination Card */}
            <Card className="rounded-sm border-border shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Fulfillment Dest.
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-black uppercase tracking-tighter text-foreground">{shippingAddress?.addressLine1}</p>
                {shippingAddress?.addressLine2 && <p className="text-muted-foreground text-xs italic">{shippingAddress.addressLine2}</p>}
                <p className="text-muted-foreground font-medium">
                  {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}
                </p>
                <Badge variant="secondary" className="mt-2 text-[9px] font-black uppercase rounded-none tracking-widest">
                  {shippingAddress?.country}
                </Badge>
              </CardContent>
            </Card>

            {/* Financial Status Card */}
            <Card className="rounded-sm border-border shadow-sm bg-white border-l-4 border-l-blue-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase font-black">Verification</span>
                  <Badge 
                    variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} 
                    className={`text-[9px] font-black ${order.paymentStatus === 'PAID' ? 'bg-green-600' : ''}`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/40 rounded-sm border border-dashed">
                  <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">System Reference</p>
                  <p className="text-[10px] font-mono font-bold break-all leading-relaxed">
                    {order.orderNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}