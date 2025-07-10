import React from "react";

export function ShippingHero() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-6 mb-10">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Shipping Information
        </h1>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Fast, Reliable Shipping Worldwide
        </h2>
        <p className="text-gray-600 mb-4">
          Get your orders delivered quickly and securely
        </p>
      </div>
      <div className="flex items-center justify-center">
        {/* Animated shipping truck icon */}
        <span className="inline-block animate-bounce">
          <svg
            width="64"
            height="48"
            viewBox="0 0 64 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="20" width="36" height="16" rx="4" fill="#2563eb" />
            <rect x="40" y="28" width="16" height="8" rx="2" fill="#6b7280" />
            <rect x="48" y="20" width="8" height="8" rx="2" fill="#93c5fd" />
            <circle cx="16" cy="40" r="4" fill="#374151" />
            <circle cx="52" cy="40" r="4" fill="#374151" />
          </svg>
        </span>
      </div>
    </section>
  );
}
