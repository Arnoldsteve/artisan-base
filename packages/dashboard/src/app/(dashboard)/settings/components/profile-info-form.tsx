"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@repo/ui/components/ui/card";
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

// Define the shape of the data for this specific form
interface ProfileInfoFormProps {
  initialData: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

// Define the validation schema using Zod
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
});

export function ProfileInfoForm({ initialData }: ProfileInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  // Mock submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated Profile Info:", values);
    toast.success("Your profile has been updated.");
  };

  return (
    <Card className="bg-[#ffffff]">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your first and last name.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                {/* Email is typically not editable */}
                <Input readOnly disabled value={initialData.email} />
              </FormControl>
            </FormItem>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
