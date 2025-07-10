import React from "react";
import { Button } from "@repo/ui/components/ui/button";

export const HelpPageLayout: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="max-w-2xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold mb-6">{title}</h1>
    <div className="prose mb-8">{children}</div>
    <Button asChild>
      <a href="/">Back to Home</a>
    </Button>
  </div>
);
