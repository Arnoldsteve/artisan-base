"use client";
import { useState } from "react";
import { useAuthForm } from "@/hooks/use-auth-form";
import { login } from "@/services/auth-service";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { CardWrapper } from "./card-wrapper";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isLoading, handleSubmit } = useAuthForm(login, "/account");

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
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs sm:text-sm text-primary hover:underline"
            >
              {" "}
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
