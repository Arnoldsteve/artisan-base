import { PageHeader } from "@/components/shared/page-header";
import { CustomerOrdersView } from "../components/customer-orders-view";
import { CustomerStats } from "../components/customer-stats";
import { CustomerContactCard } from "../components/customer-contact-card";
import { Button } from "@repo/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerApiClient } from "@/lib/server-api";
import { CustomerDetails } from "@/types/customers";


export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const resolvedParams = await params;

  const serverApi = await createServerApiClient();

  let customer: CustomerDetails;

  try {
    customer = await serverApi.get<CustomerDetails>(
      `/dashboard/customers/${resolvedParams.customerId}`
    );
  } catch (error) {
    console.error(
      `Failed to fetch customer ${resolvedParams.customerId}:`,
      error
    );
    notFound();
  }

  const customerOrders = customer.orders || [];

  return (
    <>
    <PageHeader title={`${customer.firstName} ${customer.lastName}`}/>
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader title={`${customer.firstName} ${customer.lastName}`}>
        <Link href={`/customers/${customer.id}/edit`}>
          <Button>Edit Customer</Button>
        </Link>
      </PageHeader>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
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
    </>
  );
}
