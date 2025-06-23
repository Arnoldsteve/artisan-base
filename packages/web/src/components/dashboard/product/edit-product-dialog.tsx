// In packages/web/src/components/dashboard/product/edit-product-dialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil } from 'lucide-react'; // Icon

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'; // All form components
import { Input } from '@/components/ui/input';
import { updateProduct } from '@/lib/api'; // We'll create this next
import { createProductSchema } from '@/lib/schemas'; // We can reuse the same schema
import { Product } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

interface EditProductDialogProps {
  product: Product;
  onProductUpdated: () => void; // <-- Accept the prop
}

// We can reuse the create schema, but make fields optional for partial updates
const editSchema = createProductSchema.partial();

export function EditProductDialog({ product, onProductUpdated }: EditProductDialogProps) {
  // const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    // Pre-fill the form with the existing product data
    defaultValues: {
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price),
      imageUrl: product.imageUrl || '',
    },
  });

  async function onSubmit(values: z.infer<typeof editSchema>) {
    try {
      await updateProduct(product.id, values);
      setOpen(false);
      onProductUpdated(); // <-- Call the callback
    } catch (error) {
      console.error('Failed to update product', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit: {product.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Handmade Leather Wallet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="49.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* {apiError && <p className="text-sm text-red-500">{apiError}</p>} */}

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
            {/* <Button type="submit">Save Changes</Button>
          </form> */}
        </Form>
      </DialogContent>
    </Dialog>
  );
}