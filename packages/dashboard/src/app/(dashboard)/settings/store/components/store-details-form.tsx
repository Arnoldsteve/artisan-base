"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useTenant } from "@/hooks/use-tenant";
import { Currency } from "@/types/currency";
import {
  updateTenantSchema,
  UpdateTenantFormData,
} from "@/validation-schemas/tenant-schema";

interface StoreDetailsFormProps {
  initialData: {
    name: string;
    baseCurrency: Currency;
    timezone: string;
  };
}

// Helper to provide human-readable labels for the Enum values
const getCurrencyLabel = (currency: Currency): string => {
  const labels: Record<Currency, string> = {
    [Currency.KES]: "Kenyan Shilling",
    [Currency.USD]: "US Dollar",
    [Currency.EUR]: "Euro",
    [Currency.GBP]: "British Pound",
    [Currency.NGN]: "Nigerian Naira",
    [Currency.GHS]: "Ghanaian Cedi",
    [Currency.ZAR]: "South African Rand",
    [Currency.JPY]: "Japanese Yen",
    [Currency.INR]: "Indian Rupee",
    [Currency.CAD]: "Canadian Dollar",
    [Currency.UGX]: "Ugandan Shilling",
    [Currency.TZS]: "Tanzanian Shilling",
  };
  return labels[currency] || currency;
};

export function StoreDetailsForm({ initialData }: StoreDetailsFormProps) {
  const { updateTenant, isUpdating } = useTenant();

  const form = useForm<UpdateTenantFormData>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues: {
      name: initialData.name,
      currency: initialData.baseCurrency,
      timezone: initialData.timezone,
    },
  });

  const { isDirty } = form.formState;

  const onSubmit = (values: UpdateTenantFormData) => {
    // Note: The hook handles the tenantId isolation and toast feedback
    updateTenant(values, {
      onSuccess: () => {
        form.reset(values); // Disable the save button after success
      },
    });
  };

  return (
    <Card className="rounded-sm shadow-sm bg-white border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Store Profile</CardTitle>
        <CardDescription>
          Regional settings for tax, currency, and reporting.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Store Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Artisan Furniture"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isUpdating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-64">
                        {Object.values(Currency).map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr} - {getCurrencyLabel(curr)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isUpdating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Africa/Nairobi">
                          Nairobi (EAT)
                        </SelectItem>
                        <SelectItem value="Africa/Lagos">
                          Lagos (WAT)
                        </SelectItem>
                        <SelectItem value="Africa/Johannesburg">
                          Johannesburg (SAST)
                        </SelectItem>
                        <SelectItem value="UTC">Universal (UTC)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="border-t px-6 py-4 bg-muted/5">
            <Button
              type="submit"
              disabled={isUpdating || !isDirty}
              className="min-w-[120px]"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
