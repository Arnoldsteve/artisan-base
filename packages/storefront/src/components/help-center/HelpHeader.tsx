import React from "react";

export function HelpHeader() {
  return (
    <div className="relative py-12 px-4 text-center bg-gradient-to-b from-white to-blue-50 rounded-b-2xl mb-8">
      <nav className="absolute left-4 top-4 text-sm text-gray-500 flex items-center gap-2">
        <a href="/" className="hover:underline">
          Home
        </a>
        <span>›</span>
        <span className="text-gray-900 font-semibold">Help Center</span>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4">
          <span className="inline-block animate-bounce">
            {/* Customer service/Help desk icon */}
            <svg width="72" height="72" fill="none" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r="36"
                fill="#2563eb"
                fillOpacity="0.08"
              />
              <rect
                x="20"
                y="32"
                width="32"
                height="20"
                rx="10"
                fill="#2563eb"
              />
              <circle cx="36" cy="28" r="10" fill="#2563eb" />
              <rect x="30" y="44" width="12" height="4" rx="2" fill="#93c5fd" />
            </svg>
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900">
          Help Center
        </h1>
        <h2 className="text-lg md:text-xl text-gray-700 mb-6">
          We're here to help you every step of the way
        </h2>
      </div>
    </div>
  );
}
