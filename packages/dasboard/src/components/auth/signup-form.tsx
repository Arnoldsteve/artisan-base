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

export function SignupForm() {
  const router = useRouter();

  // State for form inputs
  // Let's use `firstName` to match your NestJS DTO
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for submission process
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // --- REAL API CALL using our clean API layer ---
      const data = await api.auth.signUp({
        firstName,
        email,
        password,
      });

      // --- SUCCESS HANDLING ---
      // After a successful sign-up, the user is immediately "logged in".
      // We should store their access token just like we do on the login page.
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      } else {
        throw new Error('Account created, but no access token was provided.');
      }

      toast.success(data.message || "Account created successfully!");
      
      // --- REDIRECTION ON SUCCESS ---
      // The first step after creating an account is usually to set up
      // their first organization/tenant. This redirection is perfect.
      router.push('/setup-organization');

    } catch (err) {
      // Our API layer formats the error message from the NestJS backend.
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsSubmitting(false); // Stop loading on error so the user can try again
    }
  };

  return (
    <CardWrapper
      headerLabel="Create an account to get started."
      backButtonLabel="Already have an account? Login"
      backButtonHref="/"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {/* Renamed to First Name for clarity */}
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
            minLength={8} // Good practice to enforce a minimum length
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}