'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();

  // State for form inputs
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
      // --- API CALL: Replace with your actual login API endpoint ---
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });

      // Mocking a successful API call for demonstration
      console.log('Attempting login for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate an error for a specific user for testing
      if (password === 'wrong') {
        throw new Error('Invalid credentials. Please try again.');
      }
      
      const response = { ok: true }; // Assume success for any other password

      if (!response.ok) {
        // const errorData = await response.json();
        // throw new Error(errorData.message || 'Failed to login.');
      }

      // --- REDIRECTION ON SUCCESS ---
      console.log('Login successful. Redirecting to dashboard...');
      router.push('/dashboard');

    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false); // Stop loading on error so user can try again
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back! Please sign in to continue."
      backButtonLabel="Don't have an account? Create one"
      backButtonHref="/signup" // Link this to your signup page
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
              Logging In...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}