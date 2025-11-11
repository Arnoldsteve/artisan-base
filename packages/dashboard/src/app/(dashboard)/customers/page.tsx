import { createServerApiClient } from "@/lib/server-api";
import { CustomersWrapper } from "./components/customers-wrapper";
import { Customer } from "@/types/customers";
import { PaginatedResponse } from "@/types/shared";

export default async function CustomersPage() {
  let initialCustomerData: PaginatedResponse<Customer>;

  try {
    const serverApi = await createServerApiClient();

    initialCustomerData = await serverApi.get<PaginatedResponse<Customer>>(
      "/dashboard/customers"
    );
  } catch (error) {
    console.error("Failed to fetch initial customers on the server:", error);
    initialCustomerData = {
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

  return <CustomersWrapper initialCustomerData={initialCustomerData} />;
}
