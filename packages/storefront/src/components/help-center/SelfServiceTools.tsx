import React from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";

export function SelfServiceTools() {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Self-Service Tools
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Order Status Checker */}
        <div className="bg-white rounded-xl border shadow p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
          <div className="flex flex-col gap-3">
            <div className="font-bold text-lg mb-1">Order Status Checker</div>
            <Input placeholder="Order Number" />
            <Input placeholder="Email" type="email" />
          </div>
          <Button size="sm" className="mt-3">Check Status</Button>
        </div>

        {/* Return Request Form */}
        <div className="bg-white rounded-xl border shadow p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
          <div className="flex flex-col gap-3">
            <div className="font-bold text-lg mb-1">Return Request</div>
            <Input placeholder="Order Number" />
            <Input placeholder="Item Name or SKU" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Reason for Return" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defective">Defective/Damaged</SelectItem>
                <SelectItem value="wrong-item">Wrong Item</SelectItem>
                <SelectItem value="changed-mind">Changed Mind</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="mt-3">Start Return</Button>
        </div>

        {/* Shipping Calculator */}
        <div className="bg-white rounded-xl border shadow p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
          <div className="flex flex-col gap-3">
            <div className="font-bold text-lg mb-1">Shipping Calculator</div>
            <Input placeholder="ZIP/Postal Code" />
            <Input placeholder="Weight (lbs)" type="number" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Shipping Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="mt-3">Calculate Cost</Button>
        </div>

        {/* Size Guide Tool */}
        <div className="bg-white rounded-xl border shadow p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
          <div className="flex flex-col gap-3">
            <div className="font-bold text-lg mb-1">Size Guide Tool</div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Product Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shirts">Shirts</SelectItem>
                <SelectItem value="pants">Pants</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="mt-3">View Size Chart</Button>
        </div>
      </div>
    </section>
  );
}
