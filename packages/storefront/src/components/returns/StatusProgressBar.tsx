import React from "react";

export function StatusProgressBar({
  steps,
}: {
  steps: { label: string; completed: boolean }[];
}) {
  return (
    <div className="flex items-center gap-2 mt-2">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div
            className={`h-2 w-8 rounded-full ${
              step.completed ? "bg-blue-700" : "bg-gray-300"
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
