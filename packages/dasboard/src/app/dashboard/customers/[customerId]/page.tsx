// src/app/dashboard/customers/[customerId]/page.tsx
import { PageHeader } from "@/components/shared/page-header";
import { mockOrders } from "@/lib/mock-data/orders"; // We'll find the customer in our mock data

// This is a Server Component that receives params from the URL
export default async function CustomerDetailPage({ params }: { params: { customerId: string } }) {
  const { customerId } = params;

  // In a real app, you would fetch the customer and their orders from your database.
  // For now, we'll find the first order that matches this customer to get their details.
  // Note: This is inefficient but fine for mock data. A real DB would be a direct lookup.
  const orderWithCustomer = mockOrders.find(o => o.customer?.email === customerId);
  const customer = orderWithCustomer?.customer;


  if (!customer) {
    return (
        <div className="p-4 md:p-8 lg:p-10">
            <PageHeader title="Customer Not Found" />
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        description={`Customer since... well, a while ago!`}
      />
      
      <div className="mt-8">
        <p>Email: {customer.email}</p>
        <h3 className="mt-6 text-xl font-semibold">Order History</h3>
        {/* We can build a list of this customer's orders here later */}
        <p className="text-muted-foreground">Order history will be displayed here.</p>
      </div>
    </div>
  );
}