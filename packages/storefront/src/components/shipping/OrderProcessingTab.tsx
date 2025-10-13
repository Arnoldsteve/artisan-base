import React from "react";

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
    <div>
      {/* Title */}
      <h3 className="text-lg font-semibold mb-4">Order Processing Timeline</h3>

      {/* Steps Timeline */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    step.complete
                      ? "border-green-600 bg-green-100"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {step.complete ? (
                    <span className="text-green-600 text-xl">✓</span>
                  ) : (
                    <span className="text-gray-400 text-xl">•</span>
                  )}
                </div>

                {/* Step Label */}
                <span className="text-xs mt-2 text-gray-700 font-medium text-center w-20">
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="w-10 h-1 bg-gray-300 rounded" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Processing Info */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h4 className="font-semibold mb-2">Processing Details</h4>
        <ul className="list-disc ml-6 text-sm mb-2 space-y-1">
          <li>
            Orders placed before <span className="font-semibold">2 PM</span>{" "}
            ship the same day within kenya
          </li>
          <li>Weekend orders process on Monday.</li>
          <li>
            Processing time:{" "}
            <span className="font-semibold">1-2 business days</span>.
          </li>
        </ul>

        {/* Legend */}
        <div className="flex gap-4 mt-3">
          <span className="inline-flex items-center text-green-700 text-xs font-semibold">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1" /> Completed
          </span>
          <span className="inline-flex items-center text-gray-400 text-xs font-semibold">
            <span className="w-3 h-3 bg-gray-300 rounded-full mr-1" /> Pending
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-400">
        You will receive email updates as your order progresses through each
        stage.
      </div>
    </div>
  );
}
