"use client";

import React, { useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

const popularTags = [
  "Order Status",
  "Returns",
  "Shipping",
  "Payment",
  "Account",
];

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Stub suggestions
  const suggestions = query
    ? [`How to ${query}?`, `FAQ about ${query}`, `Contact support for ${query}`]
    : [];

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-full max-w-xl">
        <Input
          type="text"
          placeholder="Search for help articles, FAQs, or topics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-4 pr-12 py-3 text-base rounded-full border border-gray-300 shadow-sm w-full md:w-[600px]"
          aria-label="Search help center"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="7" stroke="#2563eb" strokeWidth="2" />
            <path
              d="M15 15l-3-3"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded shadow z-10">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {popularTags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}
