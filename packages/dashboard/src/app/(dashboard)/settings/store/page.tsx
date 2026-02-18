"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useTenant } from "@/hooks/use-tenant";
import { StoreDetailsForm } from "./components/store-details-form";
import { StoreDomainsForm } from "./components/store-domains-form";
import { StoreDangerZone } from "./components/store-danger-zone";
import { DataTableSkeleton } from "@/components/shared/data-table";

export default function StorePage() {
  const { tenant, isLoading, isError } = useTenant();

  if (isLoading) return <DataTableSkeleton />;
  if (isError || !tenant) return <p className="p-4 text-destructive">Failed to load store configuration.</p>;

  return (
    <>
      <PageHeader title="Store Settings" />
      <div className="px-4 space-y-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <StoreDetailsForm initialData={tenant} />
          <StoreDomainsForm
            initialData={{
              subdomain: tenant.subdomain,
              customDomain: tenant.customDomain,
            }}
          />
        </div>
        <StoreDangerZone storeName={tenant.name} />
      </div>
    </>
  );
}