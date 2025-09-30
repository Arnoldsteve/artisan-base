import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { StatusProgressBar } from "./StatusProgressBar";
import { formatMoney } from "@/lib/money";

export function ReturnCard({ ret }: { ret: any }) {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in_transit":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "approved":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center";

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg shadow-sm">
      {/* Top Section - Product Info */}
      <div className="p-6">
        <div className="flex flex-col items-start gap-5">
          {/* Top Section with Image + Title */}
          <div className="flex flex-row items-center gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
              <Image
                src={defaultImage}
                alt={ret.itemName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-xl leading-tight">
              {ret.itemName}
            </h3>
          </div>

          {/* Details Section */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Refund Amount
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatMoney(ret.refundAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 font-medium">
                Order: {ret.orderNumber}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  ret.status
                )}`}
              >
                {formatStatus(ret.status)}
              </span>
            </div>

            <p className="text-sm text-gray-600 italic leading-relaxed mb-4">
              {ret.returnReason}
            </p>

            {/* Progress Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Return Progress
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Est. {ret.expectedCompletion}
                </span>
              </div>
              <StatusProgressBar steps={ret.statusSteps} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Need help?</span> Contact support
          </div>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Track Return
          </Button>
        </div>
      </div>
    </div>
  );
}
