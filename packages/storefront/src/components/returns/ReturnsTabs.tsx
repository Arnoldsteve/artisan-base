"use client";

import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("my-returns");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Returns & Exchanges
          </h1>
          <p className="text-gray-600">
            Manage your returns, start new ones, and track your refunds
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "my-returns" && <MyReturnsTab />}
          {activeTab === "start-return" && <StartReturnTab />}
          {activeTab === "history" && <ReturnHistoryTab />}
          {activeTab === "policy" && <PolicyFaqTab />}
        </div>
      </div>
    </div>
  );
}