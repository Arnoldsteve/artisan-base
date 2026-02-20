"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { BillingHistoryItem } from "@/types/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

interface BillingHistoryTableProps {
  // Use a default empty array to prevent 'undefined' errors
  data?: BillingHistoryItem[]; 
}

export function BillingHistoryTable({ data = [] }: BillingHistoryTableProps) {
  // 1. Safe Table Initialization: 
  // If 'data' is undefined during the first render, we use the empty array fallback
  const table = useReactTable({
    data: data ?? [], 
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="rounded-sm shadow-sm bg-white border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6 pb-6">
        {/* 2. Safety Check: Handle null, undefined, or empty arrays gracefully */}
        {(!data || data.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border rounded-md border-dashed">
            <p className="text-sm italic">No billing records found for this store.</p>
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </CardContent>
    </Card>
  );
}