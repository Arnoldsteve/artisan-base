import React from "react";
import { BillingSettings } from "../components/profile-settings-page";

interface BillingPageProps {
  plans: any[];
  subscription: any;
  invoices: any[];
}
export default function page({ plans, subscription, invoices }: BillingPageProps) {
  return (
    <BillingSettings
      plans={plans}
      subscription={subscription}
      invoices={invoices}
    />
  );
}
