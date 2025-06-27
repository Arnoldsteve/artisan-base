'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use this for Next.js App Router
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';
import { Loader2 } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for submission process
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setError(null);

    try {
      // --- API CALL: Replace with your actual signup API endpoint ---
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // });

      // Mocking a successful API call for demonstration
      console.log('Submitting signup:', { name, email });
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { ok: true }; // Assume success

      if (!response.ok) {
        // If API returns an error, handle it here
        // const errorData = await response.json();
        // throw new Error(errorData.message || 'Failed to create account.');
        throw new Error('This email is already in use.'); // Example error
      }

      // --- REDIRECTION ON SUCCESS ---
      // If the signup is successful, redirect the user
      console.log('Account created successfully. Redirecting...');
      router.push('/setup-organization');

    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false); // Stop loading on error
    } 
    // No need for a `finally` block here because successful navigation will unmount the component
  };

  return (
    <CardWrapper
      headerLabel="Create an account to get started."
      backButtonLabel="Already have an account? Login"
      backButtonHref="/"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
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