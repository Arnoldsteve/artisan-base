"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { CardWrapper } from "./card-wrapper";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/api";
import { useSetupOrganization } from "@/hooks/use-setup-organization";

// --- Helper Functions & Types --- (No changes needed here)
type SubdomainStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// --- Main Component ---

export function SetupOrganizationForm() {
  const router = useRouter();
  const {
    organizationName,
    setOrganizationName,
    subdomain,
    setSubdomain,
    isSubmitting,
    formError,
    handleSubmit,
    handleSubdomainChange,
    SubdomainFeedback,
    suggestions,
  } = useSetupOrganization();

  return (
    <CardWrapper
      headerLabel="Let's set up your first organization."
      backButtonLabel="Log out"
      backButtonHref="/logout"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="organization-name">Organization Name</Label>
          <Input
            id="organization-name"
            type="text"
            placeholder="Acme Inc."
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subdomain">Your Organization's URL</Label>
          <div className="flex items-center">
            <Input
              id="subdomain"
              type="text"
              placeholder="acme"
              className="rounded-r-none focus:ring-0 focus:ring-offset-0"
              value={subdomain}
              onChange={handleSubdomainChange}
              disabled={isSubmitting}
              required
            />
            <span className="rounded-l-none border-l-0 bg-muted px-3 py-2 text-muted-foreground text-sm border border-input">
              .yourdomain.com
            </span>
          </div>
          {SubdomainFeedback}
          {suggestions && suggestions.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Suggestions: {suggestions.join(", ")}
            </div>
          )}
        </div>
        {formError && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {formError}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loader mr-2" />
              Creating Organization...
            </>
          ) : (
            "Create Organization"
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
