import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { StatusProgressBar } from "./StatusProgressBar";

export function ReturnCard({ ret }: { ret: any }) {
  return (
    <div className="bg-gray-50 rounded-lg shadow p-5 flex gap-4 items-center">
      <img
        src={ret.productImage}
        alt={ret.itemName}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <div className="font-bold text-lg">{ret.itemName}</div>
        <div className="text-sm text-gray-500">Order: {ret.orderNumber}</div>
        <div className="italic text-sm">{ret.returnReason}</div>
        <StatusProgressBar steps={ret.statusSteps} />
      </div>
      <div className="text-right flex flex-col gap-2">
        <div className="font-bold text-xl">${ret.refundAmount.toFixed(2)}</div>
        <div className="text-xs text-gray-500">
          Est. complete: {ret.expectedCompletion}
        </div>
        <Button size="sm">Track Return</Button>
      </div>
    </div>
  );
}
