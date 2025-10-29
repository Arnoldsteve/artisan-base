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

interface StoreDomainsFormProps {
  initialData: {
    subdomain: string;
    customDomain: string | null;
  };
}

const formSchema = z.object({
  // You might add validation for a valid domain name here later
  customDomain: z.string().optional().or(z.literal("")),
});

export function StoreDomainsForm({ initialData }: StoreDomainsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { customDomain: initialData.customDomain || "" },
  });

  const { isSubmitting, isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated Domain Info:", values);
    toast.success("Domain settings have been saved.");
  };

  return (
    <Card  className="rounded-sm shadow-xs bg-[#fff]">
      <CardHeader>
        <CardTitle>Domains</CardTitle>
        <CardDescription>Manage your store's domains.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Subdomain</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    disabled
                    value={initialData.subdomain}
                    className="rounded-r-none"
                  />
                  <span className="px-4 h-10 flex items-center bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .yourplatform.com
                  </span>
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                The subdomain cannot be changed after creation.
              </p>
            </FormItem>
            <FormField
              control={form.control}
              name="customDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., www.mystore.com" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Point your domain's CNAME record to your subdomain.
                  </p>
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
