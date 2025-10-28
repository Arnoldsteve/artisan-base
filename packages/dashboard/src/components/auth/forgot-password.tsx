"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { CardWrapper } from "./card-wrapper";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Simulate sending reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage(
        "If an account exists with that email, a reset link has been sent."
      );
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/"
    >
      <form
        onSubmit={handleSubmit}
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

        {message && (
          <p className="text-sm bg-muted/50 p-3 rounded-md text-center">
            {message}
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
