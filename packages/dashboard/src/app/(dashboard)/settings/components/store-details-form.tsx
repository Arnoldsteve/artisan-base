"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@repo/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
interface StoreDetailsFormProps {
  initialData: { name: string };
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name must be at least 3 characters." }),
});

export function StoreDetailsForm({ initialData }: StoreDetailsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Mock an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated Store Details:", values);
    toast.success("Store details have been updated.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Details</CardTitle>
        <CardDescription>Update the name of your store.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Artisan Base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
