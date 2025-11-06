"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { CardWrapper } from "./card-wrapper";

import { useCreateTenant, useSubdomainAvailability } from "@/hooks/use-tenant";
import { useAuthContext } from "@/contexts/auth-context";
import { slugify } from "@/utils/slugify";
import {
  createTenantSchema,
  type CreateTenantFormData,
} from "@/validation-schemas/tenant-schema";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { capitalizeFirstLetter } from "@/utils/string-utils";

export function SetupOrganizationForm() {
  const { logout } = useAuthContext();
  const { mutateAsync: createTenant } = useCreateTenant();

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      storeName: "",
      subdomain: "",
    },
  });

  const subdomain = form.watch("subdomain");

  const {
    data: availability,
    isLoading: isCheckingAvailability,
    isValidFormat,
    isValidLength,
    isError,
  } = useSubdomainAvailability(subdomain);

  useEffect(() => {
    const name = form.watch("storeName");
    form.setValue("subdomain", slugify(name), { shouldValidate: true });
  }, [form.watch("storeName")]);

  const onSubmit = async (values: CreateTenantFormData) => {
    if (availability && !availability.isAvailable) {
      toast.error("Subdomain is already taken.");
      return;
    }

    await createTenant(values);
  };

  return (
    <CardWrapper
      headerLabel="Let's set up your first store."
      backButtonLabel="Log out"
      backButtonAction={logout}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g. SaTechs Solutions"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Store's URL</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="satechs-solutions"
                      {...field}
                      required
                    />
                  </FormControl>
                  <span className="rounded-l-none border-l-0 bg-muted px-3 py-2 text-sm text-muted-foreground">
                    .artisanbase.com
                  </span>
                </div>
                <SubdomainFeedback />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={
              isCheckingAvailability ||
              !isValidFormat ||
              !isValidLength ||
              (availability && !availability.isAvailable)
            }
          >
            Create Store
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );

  function SubdomainFeedback() {
    if (!subdomain) return null;

    if (!isValidLength)
      return (
        <p className="text-destructive flex items-center text-xs">
          <XCircle className="mr-1 h-3 w-3" /> Must be at least 3 characters.
        </p>
      );

    if (!isValidFormat)
      return (
        <p className="text-destructive flex items-center text-xs">
          <XCircle className="mr-1 h-3 w-3" /> Only letters, numbers, hyphens.
        </p>
      );

    if (isCheckingAvailability)
      return (
        <p className="text-muted-foreground flex items-center text-xs">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Checking...
        </p>
      );

    if (isError)
      return (
        <p className="text-destructive flex items-center text-xs">
          <XCircle className="mr-1 h-3 w-3" /> Error checking availability.
        </p>
      );

    if (availability?.isAvailable)
      return (
        <p className="text-green-600 flex items-center text-xs">
          <CheckCircle className="mr-1 h-3 w-3" /> Available!
        </p>
      );

    return (
      <p className="text-destructive flex items-center text-xs">
        <XCircle className="mr-1 h-3 w-3" /> Taken.
      </p>
    );
  }
}
