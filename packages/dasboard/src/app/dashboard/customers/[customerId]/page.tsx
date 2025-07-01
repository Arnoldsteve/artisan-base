// src/app/dashboard/customers/[customerId]/page.tsx
import { PageHeader } from "@/components/shared/page-header";
import { mockCustomers } from "@/lib/mock-data/customers";
import { mockOrders } from "@/lib/mock-data/orders";
import { CustomerOrdersView } from "../components/customer-orders-view";
import { CustomerStats } from "../components/customer-stats";
import { CustomerContactCard } from "../components/customer-contact-card";
import { Button } from "@repo/ui";
import Link from "next/link";
import { notFound } from "next/navigation"; 

// This is the main Server Component for the page
export default async function CustomerDetailPage({ params }: { params: { customerId: string } }) {

  const customer = mockCustomers.find(c => c.id === params.customerId);
  
  if (!customer) {
    notFound();
  }

  // ✅ THE FIX: Filter orders by the customer's ID for reliability.
  const customerOrders = mockOrders.filter(o => o.customerId === customer.id);

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader title={`${customer.firstName} ${customer.lastName}`}>
        {/* The edit button can be added back when the edit page is ready */}
        {/* <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button>Edit Customer</Button>
        </Link> */}
      </PageHeader>
      
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2">
            <CustomerOrdersView initialOrders={customerOrders as any} />
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