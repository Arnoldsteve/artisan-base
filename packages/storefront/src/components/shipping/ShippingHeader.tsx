import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

export function ShippingHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="px-2">
          <a href="/help-center">← Back to Help Center</a>
        </Button>
        <nav className="text-sm text-gray-500 flex items-center gap-2">
          <a href="/" className="hover:underline">Home</a>
          <span>›</span>
          <a href="/help-center" className="hover:underline">Help Center</a>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Shipping Information</span>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Search shipping questions..." className="w-64" />
      </div>
    </header>
  );
} 