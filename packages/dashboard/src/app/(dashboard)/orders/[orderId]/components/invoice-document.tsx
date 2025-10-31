"use client";

import React from "react";
import { Order } from "@/types/orders";

interface InvoiceDocumentProps {

    // shouldm atch the ordr
  order: any;
}

export function InvoiceDocument({ order }: InvoiceDocumentProps) {
  const {
    orderNumber,
    createdAt,
    status,
    paymentStatus,
    billingAddress,
    shippingAddress,
    items,
    subtotal,
    taxAmount,
    shippingAmount,
    totalAmount,
    currency,
  } = order;

  return (
    <div className="p-8 text-gray-900 bg-white">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-sm text-gray-500">Order #{orderNumber}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">Artisan Base</h2>
          <p className="text-sm text-gray-600">support@artisanbase.com</p>
        </div>
      </header>

      {/* Statuses */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-semibold">Order Status:</span> {status}
          </p>
          <p>
            <span className="font-semibold">Payment Status:</span> {paymentStatus}
          </p>
        </div>
      </section>

      {/* Addresses */}
      <section className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-1">Billing Address</h3>
          <address className="text-sm not-italic leading-5">
            {billingAddress?.street}
            <br />
            {billingAddress?.city}, {billingAddress?.region}
            <br />
            {billingAddress?.country} {billingAddress?.zipCode}
          </address>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Shipping Address</h3>
          <address className="text-sm not-italic leading-5">
            {shippingAddress?.street}
            <br />
            {shippingAddress?.city}, {shippingAddress?.region}
            <br />
            {shippingAddress?.country} {shippingAddress?.zipCode}
          </address>
        </div>
      </section>

      {/* Items Table */}
      <table className="w-full text-sm border-t border-b mb-8">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="py-2 px-3 font-medium">Item</th>
            <th className="py-2 px-3 font-medium text-center">Quantity</th>
            <th className="py-2 px-3 font-medium text-right">Unit Price</th>
            <th className="py-2 px-3 font-medium text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} className="border-t">
              <td className="py-2 px-3">{item.productName}</td>
              <td className="py-2 px-3 text-center">{item.quantity}</td>
              <td className="py-2 px-3 text-right">
                {currency} {Number(item.unitPrice).toFixed(2)}
              </td>
              <td className="py-2 px-3 text-right">
                {currency} {(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex flex-col items-end gap-1 text-sm mb-10">
        <p>
          Subtotal:{" "}
          <span className="font-medium">
            {currency} {Number(subtotal).toFixed(2)}
          </span>
        </p>
        <p>
          Tax:{" "}
          <span className="font-medium">
            {currency} {Number(taxAmount).toFixed(2)}
          </span>
        </p>
        <p>
          Shipping:{" "}
          <span className="font-medium">
            {currency} {Number(shippingAmount).toFixed(2)}
          </span>
        </p>
        <p className="text-lg font-bold mt-2">
          Total: {currency} {Number(totalAmount).toFixed(2)}
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 border-t pt-4">
        Thank you for your purchase!  
      </footer>
    </div>
  );
}
