"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MyReturnsTab } from "./MyReturnsTab";
import { StartReturnTab } from "./StartReturnTab/StartReturnTab";
import { ReturnHistoryTab } from "./ReturnHistoryTab";
import { PolicyFaqTab } from "./PolicyFaqTab";

const tabs = [
  { id: "my-returns", label: "My Returns" },
  { id: "start-return", label: "Start New Return" },
  { id: "history", label: "Return History" },
  { id: "policy", label: "Policy & FAQ" },
];

export function ReturnsTabs() {
  const [activeTab, setActiveTab] = React.useState("my-returns");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Returns & Exchanges
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your returns, start new ones, and track your refunds
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <TabsList className="hidden sm:inline-flex h-auto w-auto bg-transparent p-0 space-x-4 lg:space-x-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-4 font-medium text-sm text-gray-500 shadow-none transition-none data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none hover:text-gray-700"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile Dropdown */}
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

        {/* Tab Content */}
        <div className="flex-1">
          <TabsContent value="my-returns" className="mt-0">
            <MyReturnsTab />
          </TabsContent>
          <TabsContent value="start-return" className="mt-0">
            <StartReturnTab />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <ReturnHistoryTab />
          </TabsContent>
          <TabsContent value="policy" className="mt-0">
            <PolicyFaqTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}