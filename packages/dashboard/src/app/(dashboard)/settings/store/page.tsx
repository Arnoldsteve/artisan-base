"use client";

import React from "react";
import { StoreSettings } from "../components/profile-settings-page";
import { Tenant } from "@/types/tenant";
import { useAuthContext } from "@/contexts/auth-context";
import { PageHeader } from "@/components/shared/page-header";

export default function StorePage() {
  const { tenants, isLoading } = useAuthContext();
  if (isLoading) {
    return <p>Loading store information...</p>;
  }

  if (!tenants || tenants.length === 0) {
    return <p>Could not load store information.</p>;
  }

  const activeTenant: Tenant = tenants[0];

  return (
    <>
      <PageHeader title="Store Settings" />
      <StoreSettings tenant={activeTenant} />;
    </>
  );
}
