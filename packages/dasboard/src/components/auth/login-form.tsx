'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/api';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('derrick@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await api.auth.login({ email, password });

      // --- THIS IS THE CORE LOGIC ---

      // 1. Store the session token (the "master key")
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      } else {
        throw new Error('Login successful, but no access token was provided.');
      }

      // 2. Check if the user has any organizations and store the selected one
      if (data.organizations && data.organizations.length > 0) {
        // For now, we automatically select the FIRST organization as the active one.
        const activeOrg = data.organizations[0];
        
        // Store the subdomain. This will be our "apartment key".
        localStorage.setItem('selectedOrgSubdomain', activeOrg.subdomain);
        
        // It's also good practice to store the name for display purposes in the UI.
        localStorage.setItem('selectedOrgName', activeOrg.name);

        toast.success(`Welcome back! Loading ${activeOrg.name}...`);
        
        // Redirect to the main dashboard.
        router.replace('/dashboard');

      } else {
        // If the user has no organizations, they must create one.
        toast.info("Welcome! Let's set up your first organization.");
        router.push('/setup-organization');
      }
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back! Please sign in to continue."
      backButtonLabel="Don't have an account? Create one"
      backButtonHref="/signup"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... The rest of your JSX is unchanged ... */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} required />
        </div>
        {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging In...</> : 'Login'}
        </Button>
      </form>
    </CardWrapper>
  );
}