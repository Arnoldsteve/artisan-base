"use client";

import React from "react";
import Image from "next/image";
import { mockReturns } from "./mock-returns";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent } from "@repo/ui/components/ui/card";

export function ReturnHistoryTab() {
  const completedReturns = mockReturns.filter((r) => r.status === "completed");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Return History</h2>

      {completedReturns.length === 0 ? (
        <div className="text-gray-500 text-sm">No completed returns yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedReturns.map((ret) => (
            <Card
              key={ret.id}
              className="hover:shadow-md transition rounded-xl border bg-white"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={ret.productImage}
                    alt={ret.itemName}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-lg">{ret.itemName}</div>
                  <div className="text-sm text-muted-foreground">
                    Order: {ret.orderNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    Returned: 2025-10-12
                  </div>
                </div>

                <div className="text-right flex flex-col gap-2">
                  <div className="font-bold text-xl">
                    ${ret.refundAmount.toFixed(2)}
                  </div>
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
