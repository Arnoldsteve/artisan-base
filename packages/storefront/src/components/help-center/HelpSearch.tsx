"use client";

import React, { useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Search } from "lucide-react";

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = query
    ? [`How to ${query}?`, `FAQ about ${query}`, `Contact support for ${query}`]
    : [];

  return (
    <div className="flex flex-col mb-8 items-center">
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
          className="pl-4 pr-12 py-3 text-base rounded-full border border-gray-300 shadow-sm w-full md:w-[600px] bg-white"
          aria-label="Search help center"
        />

        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded shadow z-10 w-full text-left">
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
    </div>
  );
}

