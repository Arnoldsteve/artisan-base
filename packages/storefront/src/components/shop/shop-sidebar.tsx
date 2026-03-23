"use client";

import { Separator } from "@repo/ui/components/ui/separator";
import React from "react";

interface ShopSidebarProps {
  description: string;
  stats: { label: string; value: string | number }[];
}

export function ShopSidebar({ description, stats }: ShopSidebarProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">About the Artisan</h3>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-sm font-black text-slate-900">{stat.value}</span>
            </div>
            {index < stats.length - 1 && <Separator className="bg-slate-50" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}