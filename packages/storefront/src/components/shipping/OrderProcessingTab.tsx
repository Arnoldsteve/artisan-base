"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Badge } from "@repo/ui/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface Step {
  label: string;
  complete: boolean;
}

const steps: Step[] = [
  { label: "Order Placed", complete: true },
  { label: "Processing", complete: true },
  { label: "Shipped", complete: false },
  { label: "Delivered", complete: false },
];

export function OrderProcessingTab() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h3 className="text-lg font-semibold">Order Processing Timeline</h3>

      {/* Steps Grid */}
      <div className="relative grid grid-cols-4 items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center text-center relative">
              {/* Step Icon */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.complete
                    ? "border-green-600 bg-green-100 text-green-700"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {step.complete ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Circle className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Step Label */}
              <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium text-gray-700">
                {step.label}
              </span>

              {/* Connector (horizontal line between steps) */}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 left-full w-full sm:w-[120%] h-[2px] bg-gray-200 z-[-1]" />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Processing Details */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Processing Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <ul className="list-disc ml-5 space-y-1">
            <li>
              Orders placed before{" "}
              <span className="font-semibold">2 PM</span> ship the same day
              within Kenya.
            </li>
            <li>Weekend orders process on Monday.</li>
            <li>
              Processing time:{" "}
              <span className="font-semibold">1–2 business days</span>.
            </li>
          </ul>

          <Separator className="my-3" />

          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border border-green-300"
            >
              Completed
            </Badge>
            <Badge variant="outline" className="text-gray-500 border-gray-300">
              Pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <p className="text-xs text-gray-400">
        You will receive email updates as your order progresses through each
        stage.
      </p>
    </div>
  );
}
