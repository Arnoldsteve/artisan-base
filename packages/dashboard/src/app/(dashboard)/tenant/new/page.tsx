"use client";

import { PageHeader } from "@/components/shared/page-header";
import { NewStoreForm } from "./components/new-store-form";

export default function NewStorePage() {
  return (
    <div className="flex flex-col min-h-[calc(100-vh-64px)]">
      <PageHeader 
        title="Create New Store" 
        // description="Expand your business by launching a new isolated store context."
      />
      <div className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <NewStoreForm />
        </div>
      </div>
    </div>
  );
}