"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react"; // Lucide icon for help/support
import { HelpSearch } from "./HelpSearch"; // Import the search component

export function HelpHeader() {
  return (
    <Card className="relative py-12 px-4 text-center bg-muted rounded-b-2xl  shadow-none border-none">
      {/* Header Content */}
      <div className="flex flex-col items-center justify-center">
        {/* <div className="mb-4">
          <span className="inline-block animate-bounce p-4 rounded-full bg-blue-100">
            <HelpCircle className="w-16 h-16 text-blue-600" />
          </span>
        </div> */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900">
          Help Center
        </h1>
        <h2 className="text-lg md:text-xl text-gray-700 mb-6">
          We're here to help you every step of the way
        </h2>

        {/* Search Component */}
        {/* <HelpSearch /> */}
      </div>
    </Card>
  );
}
