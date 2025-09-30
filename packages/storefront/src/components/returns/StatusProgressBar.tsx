import React from "react";

export function StatusProgressBar({
  steps,
}: {
  steps: { label: string; completed: boolean }[];
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div
            className={`h-2 w-10 rounded-full transition-colors ${
              step.completed ? "bg-blue-600" : "bg-gray-300"
            }`}
            title={step.label}
          />
          {idx < steps.length - 1 && (
            <span className="text-xs text-gray-400">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
