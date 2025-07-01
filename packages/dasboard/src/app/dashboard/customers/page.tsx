'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Component Imports
import { CustomersView } from './components/customers-view';
import { DataTableSkeleton } from '@/components/shared/data-table';
import { CustomerColumn } from './components/columns';

// Import your centralized mock data
import { mockCustomers } from '@/lib/mock-data/customers';
import { mockOrders } from '@/lib/mock-data/orders';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function runs once to prepare the data for the table.
    // In a real app, this logic would be on your server/API endpoint.
    const processMockData = () => {
      try {
        // Transform the raw mock data into the CustomerColumn format
        const formattedCustomers: CustomerColumn[] = mockCustomers.map(customer => {
          
          // 1. Find all orders for the current customer using their email as the link
          const customerOrders = mockOrders.filter(
            order => order.customer?.email === customer.email
          );

          // 2. Calculate the total amount spent from 'PAID' orders
          const totalSpent = customerOrders
            .filter(order => order.paymentStatus === 'PAID')
            .reduce((sum, order) => sum + order.totalAmount, 0);

          // 3. Get the total count of orders
          const orderCount = customerOrders.length;

          // 4. Combine first and last name for display
          const name = `${customer.firstName} ${customer.lastName}`.trim();

          // 5. Return the final object that matches the CustomerColumn type
          return {
            id: customer.id,
            name: name,
            email: customer.email,
            orderCount: orderCount,
            totalSpent: totalSpent,
            createdAt: new Date(customer.createdAt).toLocaleDateString(), // Format date for display
          };
        });

        setCustomers(formattedCustomers);

      } catch (error) {
        console.error("Failed to process mock data:", error);
        toast.error("There was an error loading customer data.");
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate a short delay like a real API call
    const timer = setTimeout(processMockData, 500);
    
    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
    
  }, []); // The empty array ensures this effect runs only once

  // While data is being processed, show the skeleton loader
  if (isLoading) {
    return (
        <div className="p-4 md:p-8 lg:p-10">
            <DataTableSkeleton />
        </div>
    );
  }

  // Once data is ready, render the main view component
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <CustomersView initialCustomers={customers} />
    </div>
  );
}