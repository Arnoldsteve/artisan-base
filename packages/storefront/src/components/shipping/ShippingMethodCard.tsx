import React from "react";

export function ShippingMethodCard({
  icon,
  title,
  deliveryTime,
  cost,
  description,
  bestFor,
  color,
  cutoff,
}: {
  icon: React.ReactNode;
  title: string;
  deliveryTime: string;
  cost: string;
  description: string;
  bestFor: string;
  color: string;
  cutoff?: string;
}) {
  return (
    <div
      className="w-[300px] bg-white rounded-xl shadow-lg p-6 mb-4"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
        borderRadius: 12,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.15s",
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" style={{ color }}>
          {icon}
        </span>
        <span className="font-bold text-lg">{title}</span>
      </div>
      <div className="font-semibold text-base mb-1" style={{ color }}>
        {deliveryTime}
      </div>
      <div className="text-sm font-medium mb-1">{cost}</div>
      <div className="text-sm text-gray-600 mb-1">{description}</div>
      <div className="text-xs text-gray-500 mb-1">Best for: {bestFor}</div>
      {cutoff && (
        <div className="text-xs text-red-600 font-semibold">{cutoff}</div>
      )}
    </div>
  );
}
