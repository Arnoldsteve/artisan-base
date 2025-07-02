import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TenantService } from '@/services/tenant-service';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type SubdomainStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export function useSetupOrganization() {
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
    if (!debouncedSubdomain) {
      setSubdomainStatus('idle');
      return;
    }
    setSubdomainStatus('checking');
    setSubdomainError(null);
    setSuggestions([]);
    TenantService.checkSubdomainAvailability(debouncedSubdomain).then(({ data, error }) => {
      if (data) {
        if (data.isAvailable) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
          setSuggestions(data.suggestions || []);
        }
      } else {
        setSubdomainStatus('invalid');
        setSubdomainError(error || 'Invalid subdomain.');
      }
    });
  }, [debouncedSubdomain]);

  const handleSubdomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomainStatus(e.target.value ? 'checking' : 'idle');
    setSubdomain(slugify(e.target.value));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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
    const { data, error } = await TenantService.createTenant({ storeName: organizationName, subdomain });
    if (data) {
      toast.success(`"${organizationName}" created successfully! Loading dashboard...`);
      router.push('/dashboard');
      router.refresh();
    } else if (error) {
      setFormError(error);
    }
    setIsSubmitting(false);
  }, [organizationName, subdomain, subdomainStatus, subdomainError, router]);

  const SubdomainFeedback = useMemo(() => {
    if (subdomainStatus === 'checking') {
      return <p className="text-sm text-muted-foreground flex items-center mt-2"><span className="loader mr-2" />Checking...</p>;
    }
    if (subdomainStatus === 'available' && debouncedSubdomain) {
      return <p className="text-sm text-green-600 flex items-center mt-2">Subdomain is available!</p>;
    }
    if (subdomainStatus === 'taken') {
      return <p className="text-sm text-destructive flex items-center mt-2">This subdomain is taken.</p>;
    }
    if (subdomainStatus === 'invalid' && subdomainError) {
      return <p className="text-sm text-destructive flex items-center mt-2">{subdomainError}</p>;
    }
    return <div className="h-[28px] mt-2"></div>;
  }, [subdomainStatus, debouncedSubdomain, subdomainError]);

  return {
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
  };
}
// REFACTOR: All organization setup business logic and state moved to hook for SRP, DRY, and testability. 