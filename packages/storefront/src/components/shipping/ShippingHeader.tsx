"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Help Center", href: "/help-center" },
  { label: "Shipping Information" },
];

export function ShippingHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="px-2">
          <a href="/help-center" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
        </Button>

        <nav className="flex items-center text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {crumb.href ? (
                <a href={crumb.href} className="hover:underline">
                  {crumb.label}
                </a>
              ) : (
                <span className="font-semibold text-foreground">
                  {crumb.label}
                </span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
