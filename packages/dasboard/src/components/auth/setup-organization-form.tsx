'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/api';

// --- Helper Functions & Types ---
type SubdomainStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const slugify = (text: string) =>
  text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

// --- Main Component ---

export function SetupOrganizationForm() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [subdomainStatus, setSubdomainStatus] = useState<SubdomainStatus>('idle');
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedSubdomain = useDebounce(subdomain, 500);

  useEffect(() => {
    if (organizationName && document.activeElement?.id !== 'subdomain') {
      setSubdomain(slugify(organizationName));
    }
  }, [organizationName]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedSubdomain) {
        setSubdomainStatus('idle');
        setSubdomainError(null);
        setSuggestions([]);
        return;
      }
      setSubdomainStatus('checking');
      setSubdomainError(null);
      setSuggestions([]);

      try {
        const data = await api.tenant.checkSubdomainAvailability(debouncedSubdomain);
        if (data.isAvailable) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        setSubdomainStatus('invalid');
        const message = (error as Error).message;
        // The backend might return an array of messages, join them for display.
        setSubdomainError(Array.isArray(message) ? message.join(', ') : message);
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
      setFormError(subdomainError || 'Please choose an available subdomain.');
      return;
    }
    if (!organizationName) {
      setFormError('Please enter an organization name.');
      return;
    }

    setIsSubmitting(true);
    try {
        const response = await api.tenant.createTenant({
            storeName: organizationName,
            subdomain,
        });

        toast.success(response.message || "Organization created successfully!");
        router.push('/select-organization'); 
        
    } catch (error) {
        setFormError((error as Error).message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const SubdomainFeedback = useMemo(() => {
    if (subdomainStatus === 'checking') {
      return <p className="text-sm text-muted-foreground flex items-center mt-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking...</p>;
    }
    if (subdomainStatus === 'available' && debouncedSubdomain) {
      return <p className="text-sm text-green-600 flex items-center mt-2"><CheckCircle className="mr-2 h-4 w-4" />Subdomain is available!</p>;
    }
    if (subdomainStatus === 'taken') {
      return <p className="text-sm text-destructive flex items-center mt-2"><XCircle className="mr-2 h-4 w-4" />This subdomain is taken.</p>;
    }
    if (subdomainStatus === 'invalid' && subdomainError) {
      return <p className="text-sm text-destructive flex items-center mt-2"><XCircle className="mr-2 h-4 w-4" />{subdomainError}</p>;
    }
    return <div className="h-[28px] mt-2"></div>; // Placeholder to prevent layout shift
  }, [subdomainStatus, debouncedSubdomain, subdomainError]);

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
            <span className="inline-flex h-10 items-center px-3 text-sm text-muted-foreground border border-l-0 rounded-r-md bg-muted">
              .yourapp.com
            </span>
          </div>
          {SubdomainFeedback}
          {suggestions.length > 0 && (
            <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">How about one of these?</p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                        <Button key={s} type="button" variant="outline" size="sm" className="h-8" onClick={() => setSubdomain(s)}>{s}</Button>
                    ))}
                </div>
            </div>
          )}
        </div>

        {formError && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{formError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting || subdomainStatus !== 'available'}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Creating Organization...' : 'Create Organization & Continue'}
        </Button>
      </form>
    </CardWrapper>
  );
}