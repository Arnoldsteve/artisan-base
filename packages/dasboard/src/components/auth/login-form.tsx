"use client";

import { useState } from "react";
import { Button, Input, Label } from "@repo/ui";
import { CardWrapper } from "./card-wrapper";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import { useFormHandler } from "@/hooks/use-form-handler"; // <-- IMPORT THE NEW HOOK

export function LoginForm() {
  const { login } = useAuthContext();

  // --- Form State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Form Submission Logic (handled by the hook) ---
  const { isLoading, error, handleSubmit } = useFormHandler(
    // 1. Pass the async function to be executed on submit
    login, 
    // 2. Pass the options for what to do on success
    {
      successMessage: "Login successful! Redirecting...",
      onSuccessRedirect: "/dashboard",
    }
  );

  // The wrapper function that collects form data and calls the hook's handleSubmit
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit({ email, password });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back! Please sign in to continue."
      backButtonLabel="Don't have an account? Create one"
      backButtonHref="/signup"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
            required
          />
        </div>
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging In...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}