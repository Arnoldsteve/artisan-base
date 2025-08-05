"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@repo/ui";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useCreateTenant, useSubdomainAvailability } from "@/hooks/use-tenant";
import { useAuthContext } from "@/contexts/auth-context";
import { useFormHandler } from "@/hooks/use-form-handler";
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
  
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  const { mutateAsync: createTenant } = useCreateTenant();
  const { 
    data: availability, 
    isLoading: isCheckingAvailability,
    isValidLength,
    isValidFormat,
    isError,
  } = useSubdomainAvailability(subdomain);

  const { isLoading: isCreating, error: formError, handleSubmit } = useFormHandler<CreateTenantDto, any>(
    createTenant,
    {
      successMessage: "Store created successfully! Redirecting...",
      onSuccessRedirect: "/dashboard",
    }
  );

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStoreName(newName);
    setSubdomain(slugify(newName));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (availability && !availability.isAvailable) {
      return;
    }
    if (!isValidLength || !isValidFormat) {
      return;
    }
    handleSubmit({ storeName, subdomain });
  };

  // --- THIS IS THE FIX ---
  // Define SubdomainFeedback as a proper component (capitalized).
  // It has implicit access to all the state and hooks from SetupOrganizationForm.
  function SubdomainFeedback() {
    if (subdomain.length > 0 && !isValidLength) {
      return (
        <p className="text-destructive flex items-center">
          <XCircle className="mr-2 h-3 w-3" />
          Must be at least 3 characters.
        </p>
      );
    }
    if (subdomain.length > 0 && !isValidFormat) {
        return (
          <p className="text-destructive flex items-center">
            <XCircle className="mr-2 h-3 w-3" />
            Only letters, numbers, and hyphens allowed.
          </p>
        );
      }
    if (isCheckingAvailability) {
      return (
        <p className="text-muted-foreground flex items-center">
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Checking availability...
        </p>
      );
    }
    if (isError) {
      return (
        <p className="text-destructive flex items-center">
          <XCircle className="mr-2 h-3 w-3" />
          Could not check availability.
        </p>
      );
    }
    if (availability && !isCheckingAvailability && isValidLength && isValidFormat) {
      return availability.isAvailable ? (
        <p className="text-green-600 flex items-center">
          <CheckCircle className="mr-2 h-3 w-3" />
          Subdomain is available!
        </p>
      ) : (
        <p className="text-destructive flex items-center">
          <XCircle className="mr-2 h-3 w-3" />
          Subdomain is taken.
        </p>
      );
    }
    return null;
  }

  return (
    <CardWrapper
      headerLabel="Let's set up your first store."
      backButtonLabel="Log out"
      backButtonAction={logout}
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input id="storeName" type="text" value={storeName} onChange={handleStoreNameChange} disabled={isCreating} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subdomain">Your Store's URL</Label>
          <div className="flex items-center">
            <Input id="subdomain" type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} disabled={isCreating} required />
            <span className="rounded-l-none border-l-0 bg-muted px-3 py-2 text-muted-foreground text-sm border-input">.artisanbase.com</span>
          </div>
          <div className="mt-2 text-xs h-4">
            {/* Now we render it as a JSX component */}
            <SubdomainFeedback />
          </div>
          {availability && !availability.isAvailable && availability.suggestions.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Suggestions: {availability.suggestions.join(", ")}
            </div>
          )}
        </div>
        {formError && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{formError}</p>
        )}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isCreating || isCheckingAvailability || !isValidLength || !isValidFormat || (availability && !availability.isAvailable)}
        >
          {isCreating ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Store...</> ) : "Create Store"}
        </Button>
      </form>
    </CardWrapper>
  );
}