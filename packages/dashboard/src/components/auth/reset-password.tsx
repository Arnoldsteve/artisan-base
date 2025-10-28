"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";

import { CardWrapper } from "./card-wrapper";
import { useFormHandler } from "@/hooks/use-form-handler";
import { authService } from "@/services/auth-service";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/validation-schemas/reset-password-schema";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

   useEffect(() => {
    const token = searchParams.get("token");
    console.log("Token from URL:", token);
    setToken(token);
  }, [searchParams]);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isLoading, error, handleSubmit: handleReset } = useFormHandler(
    authService.resetPassword,
    {
      successMessage: "Password has been reset successfully! You can now log in.",
      onSuccessRedirect: "/auth/login",
    }
  );

  const onSubmit = (data: ResetPasswordSchema) => {
    if (!token) {
      form.setError("token", {
        type: "manual",
        message: "Invalid or missing password reset token.",
      });
      return;
    }

    handleReset({ token, newPassword: data.password });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-1 sm:px-2 md:px-0"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                    disabled={isLoading}
                    className="text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-enter new password"
                    {...field}
                    disabled={isLoading}
                    className="text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md text-center">
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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
