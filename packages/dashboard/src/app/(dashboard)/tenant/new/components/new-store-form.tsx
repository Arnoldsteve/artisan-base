"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@repo/ui/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { useTenant } from "@/hooks/use-tenant";
import { tenantService } from "@/services/tenant-service";
import { createTenantSchema, CreateTenantFormData } from "@/validation-schemas/tenant-schema";
import { Currency } from "@/types/currency";

// Enterprise Standard: Timezone and Currency constants
const TIMEZONES = [
  { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
  { value: "Africa/Lagos", label: "Lagos (WAT)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
  { value: "UTC", label: "Universal (UTC)" },
];

export function NewStoreForm() {
  const router = useRouter();
  const { createStore, isCreatingStore } = useTenant();
  
  // Subdomain validation state
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      subdomain: "",
      currency: Currency.KES,
      timezone: "Africa/Nairobi",
    },
  });

  const subdomainValue = form.watch("subdomain");

  // Real-time Subdomain Availability Logic (Debounced)
  useEffect(() => {
    if (subdomainValue?.length < 3) {
      setIsSubdomainAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsCheckingSubdomain(true);
      try {
        const { available } = await tenantService.checkSubdomainAvailability(subdomainValue);
        setIsSubdomainAvailable(available);
      } catch {
        setIsSubdomainAvailable(false);
      } finally {
        setIsCheckingSubdomain(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [subdomainValue]);

  const onSubmit = (data: any) => {
    if (!isSubdomainAvailable) return;
    
    console.log("DATA", data)
    createStore(data, {
      onSuccess: (newStore) => {
        // Redirect to the home of the new store
        // router.push('/home'); // The context switch happens via selectTenant inside the hook logic
        window.location.href = "/home"; // Hard reload to ensure fresh store context
      },
    });
  };

  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl">Store Configuration</CardTitle>
        <CardDescription>
          This will create a completely isolated environment for your new business.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Store Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern Decor" {...field} disabled={isCreatingStore} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subdomain with Status Indicator */}
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store URL (Subdomain)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="modern-decor" 
                        {...field} 
                        className="pr-10"
                        disabled={isCreatingStore}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      />
                      <div className="absolute right-3 top-2.5">
                        {isCheckingSubdomain && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        {!isCheckingSubdomain && isSubdomainAvailable === true && <Check className="h-4 w-4 text-green-500" />}
                        {!isCheckingSubdomain && isSubdomainAvailable === false && <X className="h-4 w-4 text-destructive" />}
                      </div>
                    </div>
                  </FormControl>
                  <p className="text-[11px] text-muted-foreground">
                    Your store will be reachable at <span className="font-semibold">{subdomainValue || 'your-name'}.artisan.com</span>
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isCreatingStore}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-64">
                        {Object.values(Currency).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Timezone */}
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isCreatingStore}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Timezone" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t py-4 bg-muted/5">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isCreatingStore}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreatingStore || isSubdomainAvailable === false || isCheckingSubdomain}
              className="min-w-[150px]"
            >
              {isCreatingStore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Provisioning...
                </>
              ) : "Launch Store"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}