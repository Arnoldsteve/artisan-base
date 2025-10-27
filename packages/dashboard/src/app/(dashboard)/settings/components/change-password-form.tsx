'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import {Input} from "@repo/ui/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@repo/ui/components/ui/form";


// Zod schema with a refinement to ensure the new passwords match
const formSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required." }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"], // Show error on the confirmation field
  });

export function ChangePasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  // Mock submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Password Change Request:", {
        currentPassword: '***', // Don't log real passwords
        newPassword: '***'
    });
    toast.success("Your password has been changed successfully.");
    form.reset(); // Reset form after successful submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          For security, you will be logged out after changing your password.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}