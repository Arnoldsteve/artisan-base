"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@repo/ui";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useCreateTenant, useSubdomainAvailability } from "@/hooks/use-tenant";
import { useAuthContext } from "@/contexts/auth-context";
import { useFormHandler } from "@/hooks/use-form-handler"; // <-- 1. IMPORT the generic form hook
import { CreateTenantDto } from "@/types/tenant";
import { CardWrapper } from "./card-wrapper";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

export function SetupOrganizationForm() {
  const { logout } = useAuthContext();

  // --- State for Form Inputs remains the same ---
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  // --- API Hooks remain the same ---
  const { mutateAsync: createTenant } = useCreateTenant(); // Use mutateAsync for useFormHandler
  const {
    data: availability,
    isLoading: isCheckingAvailability,
    isValidLength,
    isValidFormat,
    isError,
  } = useSubdomainAvailability(subdomain);

  // --- 2. USE the generic form handler for submission state ---
  const {
    isLoading: isCreating,
    error: formError,
    handleSubmit,
  } = useFormHandler<CreateTenantDto, any>(createTenant, {
    successMessage: "Store created successfully! Redirecting...",
    onSuccessRedirect: "/dashboard",
  });

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStoreName(newName);
    setSubdomain(slugify(newName));
  };

  // 3. Wrapper function to validate before calling the hook's handleSubmit
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Perform manual pre-submission checks
    if (availability && !availability.isAvailable) {
      // The hook's error state is separate, so we can't set it directly.
      // We can rely on the disabled state of the button instead.
      return;
    }
    if (!isValidLength || !isValidFormat) {
      return;
    }

    // Call the generic handler with the form data
    handleSubmit({ storeName, subdomain });
  };

  // SubdomainFeedback component remains the same
  const SubdomainFeedback = () => {
    // ... no changes needed here ...
  };

  return (
    <CardWrapper
      headerLabel="Let's set up your first store."
      backButtonLabel="Log out"
      backButtonAction={logout}
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            type="text"
            value={storeName}
            onChange={handleStoreNameChange}
            disabled={isCreating}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subdomain">Your Store's URL</Label>
          <div className="flex items-center">
            <Input
              id="subdomain"
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              disabled={isCreating}
              required
            />
            <span className="rounded-l-none border-l-0 bg-muted px-3 py-2 text-muted-foreground text-sm border-input">
              .artisanbase.com
            </span>
          </div>
          <div className="mt-2 text-xs h-4">
            <SubdomainFeedback />
          </div>
          {availability &&
            !availability.isAvailable &&
            availability.suggestions.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Suggestions: {availability.suggestions.join(", ")}
              </div>
            )}
        </div>
        {formError && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {formError}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          // `isCreating` now comes from the useFormHandler hook
          disabled={
            isCreating ||
            isCheckingAvailability ||
            !isValidLength ||
            !isValidFormat ||
            (availability && !availability.isAvailable)
          }
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Store...
            </>
          ) : (
            "Create Store"
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
