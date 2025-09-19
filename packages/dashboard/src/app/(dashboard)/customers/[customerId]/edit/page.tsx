// File: packages/dasboard/src/app/dashboard/customers/[customerId]/edit/page.tsx
'use client'; // This page MUST be a client component to use hooks

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // <-- 1. IMPORT useParams
import { useCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { EditCustomerSheet } from '../../components/edit-customer-sheet';
import { Customer, UpdateCustomerDto } from '@/types/customers';

// This component no longer needs to be async or receive props
export default function EditCustomerPage() {
  const router = useRouter();
  
  // 2. USE the useParams hook to get the route parameters
  const params = useParams();
  
  // Ensure customerId is a string, handle the case where it might be an array
  const customerId = Array.isArray(params.customerId) ? params.customerId[0] : params.customerId;
  console.log('Customer ID:', customerId); // Debugging line to check the ID

  // Fetch the customer's data using our hook and the ID from params
  const { data: customer, isLoading, isError } = useCustomer(customerId);
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

  // State to control the sheet's visibility
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Automatically open the sheet once the customer data has loaded
  useEffect(() => {
    if (!isLoading && customer) {
      setIsSheetOpen(true);
    }
  }, [isLoading, customer]);
  
  const handleSaveChanges = (formData: UpdateCustomerDto & { id?: string }) => {
    if (formData.id) {
      const { id, ...updateData } = formData;
      console
      updateCustomer({ id, data: updateData }, {
        onSuccess: () => {
          setIsSheetOpen(false);
          router.push(`/customers/${id}`);
        },
      });
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    // When the sheet is closed, navigate back to the customer detail page
    router.back();
  };
  
  if (isLoading) {
    return <div>Loading customer for editing...</div>;
  }
  
  if (isError) {
    return <div>Error loading customer data. Please try again.</div>;
  }

  // This page's main purpose is to render the EditCustomerSheet component
  return (
    <EditCustomerSheet
      isOpen={isSheetOpen}
      onClose={handleCloseSheet}
      customer={customer}
      onSave={handleSaveChanges}
      isPending={isUpdating}
    />
  );
}