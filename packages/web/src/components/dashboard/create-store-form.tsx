// In packages/web/src/components/dashboard/create-store-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createStore } from '@/lib/api'; // We will create this next
import { useRouter } from 'next/navigation';
import { createStoreSchema } from '@/lib/schemas'; // <-- Import the schema


export function CreateStoreForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof createStoreSchema>>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
      id: '',
    },
  });

  async function onSubmit(values: z.infer<typeof createStoreSchema>) {
    try {
      await createStore(values);
      // A full page reload is the easiest way to refresh all user data
      window.location.reload(); 
    } catch (error: any) {
      console.error('Failed to create store', error);
      // You could set an error state here to show in the form
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Your Artisan Store</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Malaika Beads" {...field} />
                  </FormControl>
                  <FormDescription>This is your store's public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store ID (Subdomain)</FormLabel>
                  <FormControl>
                    <Input placeholder="malaika-beads" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be your store's unique URL. Use only lowercase letters, numbers, and dashes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating...' : 'Create Store'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}