import React from "react";
import { mockReturns } from "./mock-returns";
import { Badge } from "@repo/ui/components/ui/badge";

export function ReturnHistoryTab() {
  // Filter only completed returns
  const completedReturns = mockReturns.filter((r) => r.status === "completed");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Return History</h2>
      {completedReturns.length === 0 ? (
        <div className="text-gray-500">No completed returns yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedReturns.map((ret) => (
            <div
              key={ret.id}
              className="bg-gray-50 rounded-lg shadow p-5 flex gap-4 items-center"
            >
              <img
                src={ret.productImage}
                alt={ret.itemName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-bold text-lg">{ret.itemName}</div>
                <div className="text-sm text-gray-500">
                  Order: {ret.orderNumber}
                </div>
                <div className="text-xs text-gray-500">
                  Returned: 2024-06-15
                </div>
              </div>
              <div className="text-right flex flex-col gap-2">
                <div className="font-bold text-xl">
                  ${ret.refundAmount.toFixed(2)}
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
