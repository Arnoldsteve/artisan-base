"use client";

import React, { useState } from "react";
import { MyReturnsTab } from "./MyReturnsTab";
import { StartReturnTab } from "./StartReturnTab/StartReturnTab";
import { ReturnHistoryTab } from "./ReturnHistoryTab";
import { PolicyFaqTab } from "./PolicyFaqTab";
import { Button } from "@repo/ui/components/ui/button";

const tabs = [
  { id: "my-returns", label: "My Returns" },
  { id: "start-return", label: "Start New Return" },
  { id: "history", label: "Return History" },
  { id: "policy", label: "Policy & FAQ" },
];

export function ReturnsTabs() {
  const [activeTab, setActiveTab] = useState("my-returns");
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
        {activeTab === "my-returns" && <MyReturnsTab />}
        {activeTab === "start-return" && <StartReturnTab />}
        {activeTab === "history" && <ReturnHistoryTab />}
        {activeTab === "policy" && <PolicyFaqTab />}
      </div>
    </div>
  );
}
