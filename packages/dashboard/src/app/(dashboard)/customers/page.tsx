import { createServerApiClient } from "@/lib/server-api";
import { CustomersView } from "./components/customers-view";
import { Customer } from "@/types/customers";
import { PaginatedResponse } from "@/types/shared";
import { PageHeader } from "@/components/shared/page-header";

export default async function CustomersPage() {
  let initialData: PaginatedResponse<Customer>;

  try {
    const serverApi = await createServerApiClient();

    initialData = await serverApi.get<PaginatedResponse<Customer>>(
      "/dashboard/customers"
    );
    console.log("Fetched initial data on the server:", initialData);
  } catch (error) {
    console.error("Failed to fetch initial customers on the server:", error);
    // On error, create a default paginated structure so the client component doesn't break.
    initialData = {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        prev: null,
        next: null,
      },
    };
  }

  return (
    <>
      <PageHeader title="Customers" />
      <div className="p-4 md:p-8 lg:p-10">
        <CustomersView initialCustomerData={initialData} />
      </div>
    </>
  );
}
