"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ShippingMethodsTab } from "./ShippingMethodsTab";
import { DeliveryTimesTab } from "./DeliveryTimesTab";
import { ShippingCostsTab } from "./ShippingCostsTab";
import { InternationalShippingTab } from "./InternationalShippingTab";
import { OrderProcessingTab } from "./OrderProcessingTab";
import { TrackOrderTab } from "./TrackOrderTab";

const tabs = [
  { id: "methods", label: "Shipping Methods" },
  { id: "delivery", label: "Delivery Times" },
  { id: "costs", label: "Shipping Costs" },
  { id: "international", label: "International Shipping" },
  { id: "processing", label: "Order Processing" },
  { id: "track", label: "Track Your Order" },
];

export function ShippingTabs() {
  const [activeTab, setActiveTab] = useState("methods");
  return (
    <div>
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "secondary"}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-t-lg"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            role="tab"
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div>
        {activeTab === "methods" && <ShippingMethodsTab />}
        {activeTab === "delivery" && <DeliveryTimesTab />}
        {activeTab === "costs" && <ShippingCostsTab />}
        {activeTab === "international" && <InternationalShippingTab />}
        {activeTab === "processing" && <OrderProcessingTab />}
        {activeTab === "track" && <TrackOrderTab />}
      </div>
    </div>
  );
}
