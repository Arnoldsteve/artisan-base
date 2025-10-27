"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { CardWrapper } from "./card-wrapper";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import { useFormHandler } from "@/hooks/use-form-handler";

export function SignupForm() {
  const { signUp } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, handleSubmit } = useFormHandler(signUp, {
    successMessage:
      "Account created! Please create your first store to continue.",
    onSuccessRedirect: "/setup-organization",
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit({ firstName, lastName, email, password });
  };

  return (
    <CardWrapper
      headerLabel="Create an account to get started."
      backButtonLabel="Already have an account? Login"
      backButtonHref="/"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
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
            minLength={8}
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
