"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { CardWrapper } from "./card-wrapper";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import { useFormHandler } from "@/hooks/use-form-handler"; 

export function LoginForm() {
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, handleSubmit } = useFormHandler(login, {
    successMessage: "Login successful! Redirecting...",
    onSuccessRedirect: "/home",
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit({ email, password });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back! Please sign in to continue."
      backButtonLabel="Don't have an account? Create one"
      backButtonHref="/auth/signup"
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href="/auth/forgot-password"
              className="text-xs sm:text-sm text-primary hover:underline"
            >
              {" "}
              Forgot password?
            </a>
          </div>
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
