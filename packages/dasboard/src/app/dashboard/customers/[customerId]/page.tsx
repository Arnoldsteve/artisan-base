// src/app/dashboard/customers/[customerId]/page.tsx
import { PageHeader } from "@/components/shared/page-header";
import { mockCustomers } from "@/lib/mock-data/customers";
import { mockOrders } from "@/lib/mock-data/orders";
import { CustomerStats } from "./components/customer-stats";
import { CustomerContactCard } from "./components/customer-contact-card";
import { CustomerOrdersView } from "./components/customer-orders-view";
import { Button } from "@repo/ui";
import Link from "next/link";

// This is the main Server Component for the page
export default async function CustomerDetailPage({ params }: { params: { customerId: string } }) {
  const decodedCustomerId = decodeURIComponent(params.customerId);
  
  // In a real app, this would be one efficient database call.
  const customer = mockCustomers.find(c => c.id === decodedCustomerId);
  const customerOrders = mockOrders.filter(o => o.customer?.email === decodedCustomerId);

  if (!customer) {
    return <div className="p-4 md:p-8 lg:p-10"><PageHeader title="Customer Not Found" /></div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader title={`${customer.firstName} ${customer.lastName}`}>
        <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button>Edit Customer</Button>
        </Link>
      </PageHeader>
      
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2">
            <CustomerOrdersView initialOrders={customerOrders} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <CustomerStats orders={customerOrders} />
          <CustomerContactCard customer={customer} />
        </div>
      </div>
    </div>
  );
}