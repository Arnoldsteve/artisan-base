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

  // State for form inputs
  const [email, setEmail] = useState('derrick@gmail.com'); // Pre-fill for easier testing
  const [password, setPassword] = useState('password123'); // Pre-fill for easier testing

  // State for submission process
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await api.auth.login({ email, password });
      console.log('Login response:', data);

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      } else {
        throw new Error('Login successful, but no access token was provided.');
      }

      toast.success(data.message || "Login successful! Redirecting...");
      
      console.log('User Organizations:', data.organizations);

      router.replace('/dashboard');

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