import React from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

export function SelfServiceTools() {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Self-Service Tools
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Order Status Checker */}
        <div
          className="bg-white rounded-xl border shadow p-6 flex flex-col gap-3"
          style={{ borderRadius: 12, borderWidth: 1 }}
        >
          <div className="font-bold text-lg mb-1">Order Status Checker</div>
          <Input placeholder="Order Number" />
          <Input placeholder="Email" type="email" />
          <Button size="sm">Check Status</Button>
        </div>
        {/* Return Request Form */}
        <div
          className="bg-white rounded-xl border shadow p-6 flex flex-col gap-3"
          style={{ borderRadius: 12, borderWidth: 1 }}
        >
          <div className="font-bold text-lg mb-1">Return Request</div>
          <Input placeholder="Order Number" />
          <Input placeholder="Item Name or SKU" />
          <select className="border rounded px-3 py-2 text-sm">
            <option value="">Reason for Return</option>
            <option>Defective/Damaged</option>
            <option>Wrong Item</option>
            <option>Changed Mind</option>
            <option>Other</option>
          </select>
          <Button size="sm">Start Return</Button>
        </div>
        {/* Shipping Calculator */}
        <div
          className="bg-white rounded-xl border shadow p-6 flex flex-col gap-3"
          style={{ borderRadius: 12, borderWidth: 1 }}
        >
          <div className="font-bold text-lg mb-1">Shipping Calculator</div>
          <Input placeholder="ZIP/Postal Code" />
          <Input placeholder="Weight (lbs)" type="number" />
          <select className="border rounded px-3 py-2 text-sm">
            <option value="">Shipping Method</option>
            <option>Standard</option>
            <option>Express</option>
            <option>Overnight</option>
          </select>
          <Button size="sm">Calculate Cost</Button>
        </div>
        {/* Size Guide Tool */}
        <div
          className="bg-white rounded-xl border shadow p-6 flex flex-col gap-3"
          style={{ borderRadius: 12, borderWidth: 1 }}
        >
          <div className="font-bold text-lg mb-1">Size Guide Tool</div>
          <select className="border rounded px-3 py-2 text-sm">
            <option value="">Product Category</option>
            <option>Shirts</option>
            <option>Pants</option>
            <option>Shoes</option>
            <option>Accessories</option>
          </select>
          <Button size="sm">View Size Chart</Button>
        </div>
      </div>
    </section>
  );
}
