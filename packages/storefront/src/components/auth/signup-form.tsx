"use client";
import { useState } from "react";
import { useAuthForm } from "@/hooks/use-auth-form";
import { signup } from "@/services/auth-service";
import Link from "next/link";
import { CardWrapper } from "./card-wrapper";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const { error, isLoading, handleSubmit } = useAuthForm(signup, "/account");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit({ firstName, lastName, email, password, phone });
  };

  return (
    <CardWrapper
      headerLabel="Create an account to get started."
      backButtonLabel="Already have an account? Login"
      backButtonHref="/auth/login"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="block mb-1 font-medium">First Name</Label>
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="block mb-1 font-medium">Last Name</Label>
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="block mb-1 font-medium">Email</Label>
          <Input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="block mb-1 font-medium">Phone (optional)</Label>
          <Input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Label className="block mb-1 font-medium">Password</Label>
          <Input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full "
          disabled={isLoading}
        >
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
