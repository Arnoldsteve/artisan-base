import React, { useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

const mockTracking = {
  status: "In Transit",
  estimatedDelivery: "July 15, 2025",
  progress: 0.6,
  steps: [
    { label: "Order Placed", complete: true },
    { label: "Shipped", complete: true },
    { label: "In Transit", complete: true },
    { label: "Out for Delivery", complete: false },
    { label: "Delivered", complete: false },
  ],
};

export function TrackOrderTab() {
  const [orderNumber, setOrderNumber] = useState("");
  const [tracking, setTracking] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleTrack = () => {
    setError("");
    if (!orderNumber.trim()) {
      setError("Please enter your order number.");
      setTracking(null);
      return;
    }
    // In real app, fetch tracking info here
    setTracking(mockTracking);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Track Your Order</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <Input
          placeholder="Enter your order number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleTrack}>Track Order</Button>
      </div>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {tracking && (
        <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
          <div className="mb-2">
            <span className="font-semibold">Status:</span> {tracking.status}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Estimated Delivery:</span>{" "}
            {tracking.estimatedDelivery}
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {tracking.steps.map((step: any, idx: number) => (
                <React.Fragment key={step.label}>
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                      step.complete
                        ? "border-blue-600 bg-blue-100"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {step.complete ? (
                      <span className="text-blue-600 text-base">✓</span>
                    ) : (
                      <span className="text-gray-400 text-base">•</span>
                    )}
                  </div>
                  {idx < tracking.steps.length - 1 && (
                    <div className="w-8 h-1 bg-gray-300 rounded" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-700 rounded"
                style={{ width: `${tracking.progress * 100}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Tracking updates are provided in real time. For more details,
            contact support.
          </div>
        </div>
      )}
    </div>
  );
}
