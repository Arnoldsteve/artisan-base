// components/RequiredLabel.tsx
import React from "react";
import { Label } from "@repo/ui/components/ui/label";

interface RequiredLabelProps {
  children: React.ReactNode;
}

export const RequiredLabel: React.FC<RequiredLabelProps> = ({ children }) => {
  return (
    <Label className="block text-sm font-medium mb-2">
      {children} <span className="text-red-500">*</span>
    </Label>
  );
};
