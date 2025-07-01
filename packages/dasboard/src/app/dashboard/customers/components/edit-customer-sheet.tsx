'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@repo/ui';
import { Customer } from '@/types/customers'; 

interface EditCustomerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Partial<Customer> | null; // Can be a partial customer for creation
  onSave: (updatedCustomer: Partial<Customer>) => void;
  isPending: boolean;
}

export function EditCustomerSheet({ isOpen, onClose, customer, onSave, isPending }: EditCustomerSheetProps) {
  // Internal state to manage form data
  const [formData, setFormData] = useState<Partial<Customer>>({});

  // When the sheet opens with a customer, populate the form.
  // If opening to create a new customer (customer is null), clear the form.
  useEffect(() => {
    setFormData(customer || {});
  }, [customer, isOpen]); // Rerun when isOpen changes to correctly handle re-opening

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const handleSaveClick = () => {
    // Pass the current form data up to the parent to handle the API call
    onSave(formData);
  };

  const isNewCustomer = !customer?.id;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isNewCustomer ? 'Add New Customer' : 'Edit Customer'}</SheetTitle>
          <SheetDescription>
            {isNewCustomer 
              ? "Fill in the details for the new customer." 
              : "Make changes to your customer here. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <Input id="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <Input id="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} className="col-span-3" placeholder="(Optional)" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          </SheetClose>
          <Button onClick={handleSaveClick} disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}