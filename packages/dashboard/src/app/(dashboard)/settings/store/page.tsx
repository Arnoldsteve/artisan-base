"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { Tenant } from "@/types/tenant";
import { StoreDetailsForm } from "./components/store-details-form";
import { StoreDomainsForm } from "./components/store-domains-form";
import { StoreDangerZone } from "./components/store-danger-zone";

export default function StorePage() {
  const { tenants, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  if (!tenants || tenants.length === 0) {
    return <p className="text-muted-foreground">Could not load store information.</p>;
  }

  const tenant: Tenant = tenants[0];

  return (
    <>
      <PageHeader title="Store Settings" />
      <div className="px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StoreDetailsForm initialData={{ name: tenant.name }} />
          <StoreDomainsForm
            initialData={{
              subdomain: tenant.subdomain,
              customDomain: tenant.customDomain || null,
            }}
          />
        </div>
        <StoreDangerZone storeName={tenant.name} />
      </div>
    </>
  );
}
