"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { CardWrapper } from "./card-wrapper";
import { Loader2 } from "lucide-react";
import { useFormHandler } from "@/hooks/use-form-handler";
import { authService } from "@/services/auth-service";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { isLoading, error, handleSubmit } = useFormHandler(
    authService.forgotPassword,
    {
      successMessage:
        "If an account exists with that email, a reset link has been sent. The link will expire in 30 minutes.",
    }
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit({ email });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <form
        onSubmit={handleFormSubmit}
        className="space-y-5 px-1 sm:px-2 md:px-0 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>

        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="text-sm sm:text-base">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="text-sm sm:text-base"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full py-2 sm:py-3 text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </CardWrapper>
  );
}
