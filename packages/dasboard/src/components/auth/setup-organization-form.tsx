'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Helper Functions & Types ---

type SubdomainStatus = 'idle' | 'checking' | 'available' | 'taken';

// A simple debounce hook to avoid excessive API calls
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

// Function to convert a string to a URL-friendly slug
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -

// --- Main Component ---

export function SetupOrganizationForm() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [subdomainStatus, setSubdomainStatus] = useState<SubdomainStatus>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Use a debounced value for the subdomain to check against the API
  const debouncedSubdomain = useDebounce(subdomain, 500);

  // Effect to auto-populate subdomain from organization name
  useEffect(() => {
    // Only update the subdomain if the user hasn't started typing in it manually
    if (organizationName && document.activeElement?.id !== 'subdomain') {
      setSubdomain(slugify(organizationName));
    }
  }, [organizationName]);

  // Effect to check subdomain availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedSubdomain) {
        setSubdomainStatus('idle');
        setSuggestions([]);
        return;
      }
      setSubdomainStatus('checking');
      setSuggestions([]); // Clear old suggestions

      try {
        // --- API CALL #1: isSubdomainAvailable ---
        // const response = await fetch(`/api/tenants/availability?subdomain=${debouncedSubdomain}`);
        // const data = await response.json();
        const data = { isAvailable: !['acme', 'test', 'admin'].includes(debouncedSubdomain) }; // Mock API call
        
        if (data.isAvailable) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
          // --- API CALL #2: suggestAlternativeSubdomains ---
          // const suggestionsResponse = await fetch(`/api/tenants/suggestions?base=${debouncedSubdomain}`);
          // const suggestionsData = await suggestionsResponse.json();
          const suggestionsData = [`${debouncedSubdomain}-1`, `${debouncedSubdomain}-corp`, `${debouncedSubdomain}-inc`]; // Mock API call
          setSuggestions(suggestionsData);
        }
      } catch (error) {
        setSubdomainStatus('idle');
        console.error("Failed to check subdomain availability", error);
      }
    };
    checkAvailability();
  }, [debouncedSubdomain]);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomainStatus(e.target.value ? 'checking' : 'idle');
    setSubdomain(slugify(e.target.value));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (subdomainStatus !== 'available') {
      setFormError('Please choose an available subdomain.');
      return;
    }
    if (!organizationName) {
      setFormError('Please enter an organization name.');
      return;
    }

    setIsSubmitting(true);
    try {
        // --- API CALL #3: createTenant ---
        // IMPORTANT: Your API expects `storeName`, so we map our `organizationName` to it.
        // const response = await fetch('/api/tenants', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ 
        //      ownerId: 'user-id-from-session', 
        //      storeName: organizationName,  // <--- Mapping happens here
        //      subdomain 
        //   }),
        // });
        console.log("Submitting:", { storeName: organizationName, subdomain });
        await new Promise(res => setTimeout(res, 1500)); // Mock network delay
        
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.message || 'Failed to create organization.');
        // }

        // const newOrganization = await response.json();
        // On success, redirect the user to their new organization's dashboard.
        // window.location.href = `http://${newOrganization.subdomain}.yourapp.com/dashboard`;
        alert(`Organization "${organizationName}" created successfully at ${subdomain}.yourapp.com!`);
        router.push('/dashboard');
        
    } catch (error) {
        setFormError((error as Error).message);
    } finally {
        setIsSubmitting(false);
    }
  };


  const SubdomainFeedback = useMemo(() => {
    if (subdomainStatus === 'checking') {
      return <p className="text-sm text-muted-foreground flex items-center mt-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking availability...</p>;
    }
    if (subdomainStatus === 'available' && debouncedSubdomain) {
      return <p className="text-sm text-green-600 flex items-center mt-2"><CheckCircle className="mr-2 h-4 w-4" />Subdomain is available!</p>;
    }
    if (subdomainStatus === 'taken') {
      return <p className="text-sm text-destructive flex items-center mt-2"><XCircle className="mr-2 h-4 w-4" />This subdomain is taken.</p>;
    }
    return null;
  }, [subdomainStatus, debouncedSubdomain]);

  return (
    <CardWrapper
      headerLabel="Let's set up your new organization."
      backButtonLabel="Need to log out?"
      backButtonHref="/logout"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="organization-name">Organization Name</Label>
          <Input 
            id="organization-name" 
            type="text" 
            placeholder="Acme Corporation" 
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
              placeholder="acme-corp"
              className="rounded-r-none focus:ring-0 focus:ring-offset-0"
              value={subdomain}
              onChange={handleSubdomainChange}
              disabled={isSubmitting}
              required
            />
            <span className="inline-flex h-10 items-center px-3 text-sm text-muted-foreground border border-l-0 rounded-r-md bg-muted">
              .yourapp.com
            </span>
          </div>
          {SubdomainFeedback}
          {suggestions.length > 0 && (
            <div className="mt-2 space-x-2">
                <span className="text-sm text-muted-foreground">Suggestions:</span>
                {suggestions.map((s) => (
                    <Button
                        key={s}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSubdomain(s)}
                    >
                        {s}
                    </Button>
                ))}
            </div>
          )}
        </div>

        {formError && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{formError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting || subdomainStatus !== 'available'}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Creating organization...' : 'Create Organization'}
        </Button>
      </form>
    </CardWrapper>
  );
}