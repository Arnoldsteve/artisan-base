'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Customer } from '@/types/customers'; 
import { Button, Input, Label } from '@repo/ui';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@repo/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui';
import { CustomerFormData, customerFormSchema } from '@/validation-schemas/customers';

interface EditCustomerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // --- THIS IS THE FIX ---
  // The sheet now expects the original Customer object (or null for creation).
  customer: Partial<Customer> | null;
  onSave: (data: CustomerFormData) => void;
  isPending: boolean;
}

export function EditCustomerSheet({ isOpen, onClose, customer, onSave, isPending }: EditCustomerSheetProps) {
  const isNewCustomer = !customer?.id;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    // Set default values for the form schema
    defaultValues: {
      id: customer?.id || undefined,
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
    },
  });

  // Effect to reset the form's values when the sheet is opened or the customer data changes
  useEffect(() => {
    if (isOpen) {
      // The form can now correctly access the individual name and phone fields
      form.reset({
        id: customer?.id || undefined,
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
      });
    }
  }, [customer, isOpen, form]);

  // The `handleSubmit` from the hook will first validate, then call our onSave
  const onSubmit = (data: CustomerFormData) => {
    onSave(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isNewCustomer ? 'Add New Customer' : 'Edit Customer'}</SheetTitle>
          <SheetDescription>
            {isNewCustomer
              ? "Fill in the details to create a new customer."
              : "Make changes to the customer here. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(Optional)" type="tel" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}