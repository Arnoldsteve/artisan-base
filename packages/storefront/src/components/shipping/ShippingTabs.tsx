"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ShippingMethodsTab } from "./ShippingMethodsTab";
import { DeliveryTimesTab } from "./DeliveryTimesTab";
import { ShippingCostsTab } from "./ShippingCostsTab";
import { InternationalShippingTab } from "./InternationalShippingTab";
import { OrderProcessingTab } from "./OrderProcessingTab";
import { TrackOrderTab } from "./TrackOrderTab";

// Tab config
const tabs = [
  { id: "methods", label: "Shipping Methods", component: <ShippingMethodsTab /> },
  { id: "delivery", label: "Delivery Times", component: <DeliveryTimesTab /> },
  { id: "costs", label: "Shipping Costs", component: <ShippingCostsTab /> },
  { id: "international", label: "International Shipping", component: <InternationalShippingTab /> },
  { id: "processing", label: "Order Processing", component: <OrderProcessingTab /> },
  { id: "track", label: "Track Your Order", component: <TrackOrderTab /> },
];

export function ShippingTabs() {
  const [activeTab, setActiveTab] = React.useState("methods");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Shipping Information
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Learn more about our shipping methods, delivery, and tracking
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        {/* Tab navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop nav */}
            <TabsList className="hidden sm:inline-flex h-auto w-auto bg-transparent p-0 space-x-4 lg:space-x-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-4 font-medium text-sm text-gray-500 shadow-none transition-none 
                  data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 hover:text-gray-700"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile select */}
            <div className="sm:hidden py-3">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tab" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tab panels */}
        <div className="flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {tab.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
