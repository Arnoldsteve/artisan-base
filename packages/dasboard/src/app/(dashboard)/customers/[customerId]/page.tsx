import { PageHeader } from "@/components/shared/page-header";
import { CustomerOrdersView } from "../components/customer-orders-view";
import { CustomerStats } from "../components/customer-stats";
import { CustomerContactCard } from "../components/customer-contact-card";
import { Button } from "@repo/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerApiClient } from "@/lib/server-api"; 
import { CustomerDetails } from "@/types/customers"; 

/**
 * This is the main Server Component for the Customer Detail page.
 * It fetches a single customer's complete data from the API.
 */
export default async function CustomerDetailPage({ params }: { params: { customerId: string } }) {

  // Create a new, authenticated API client for this server-side request
  const serverApi = await createServerApiClient();

  let customer: CustomerDetails;

  try {
    // --- THIS IS THE FIX ---
    // Fetch the specific customer by their ID from your live API.
    // The backend should return the customer with their related orders and addresses.
    customer = await serverApi.get<CustomerDetails>(`/dashboard/customers/${params.customerId}`);
  } catch (error) {
    // If the API returns a 404 or any other error, trigger Next.js's notFound.
    console.error(`Failed to fetch customer ${params.customerId}:`, error);
    notFound();
  }

  // The customer object now contains the real orders from the database
  const customerOrders = customer.orders || [];

  return (
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
  );
}