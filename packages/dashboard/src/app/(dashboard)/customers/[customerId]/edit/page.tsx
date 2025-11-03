'use client'; 

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // <-- 1. IMPORT useParams
import { useCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { EditCustomerSheet } from '../../components/edit-customer-sheet';
import { Customer, UpdateCustomerDto } from '@/types/customers';

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  
  const customerId = Array.isArray(params.customerId) ? params.customerId[0] : params.customerId ?? null;

  // console.log('Customer ID:', customerId); // Debugging line to check the ID

  const { data: customer, isLoading, isError } = useCustomer(customerId);
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    router.back();
  };
  
  if (isLoading) {
    return <div>Loading customer for editing...</div>;
  }
  
  if (isError) {
    return <div>Error loading customer data. Please try again.</div>;
  }

  return (
    <EditCustomerSheet
      isOpen={isSheetOpen}
      onClose={handleCloseSheet}
      customer={customer ?? null}
      onSave={handleSaveChanges}
      isPending={isUpdating}
    />
  );
}