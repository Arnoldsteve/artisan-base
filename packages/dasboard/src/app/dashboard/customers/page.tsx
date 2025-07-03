'use client'; 

import { createServerApiClient } from '@/services/server-api';
import { CustomersView } from './components/customers-view';
import { Customer } from '@/types/customers';

export default async function CustomersPage() {
  let customers: Customer[] = [];
  try {
    const serverApi = await createServerApiClient();
    const response = await serverApi.get("/dashboard/customers");
    customers = response.data.data;
    if (!customers) {
      console.warn("API response did not contain a 'data' array for customers.");
      customers = [];
    }
  } catch (error) {
    console.error("Failed to fetch initial customers:", error);
  }

  

  // Once data is ready, render the main view component
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <CustomersView initialCustomers={customers} />
    </div>
  );
}