"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useUpdateProfile } from "@/hooks/use-profile"; // Import the real hook

interface ProfileInfoFormProps {
  initialData: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .trim(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

export function ProfileInfoForm({ initialData }: ProfileInfoFormProps) {
  // 1. Inject the Global Identity Mutation
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
    },
  });

  const { isDirty } = form.formState;

  // 2. Real Submission Handler
  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values, {
      onSuccess: () => {
        // Reset the "isDirty" state so the button disables again
        form.reset(values);
      },
    });
  };

  return (
    <Card className="bg-white rounded-sm shadow-sm border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        <CardDescription>
          Your identity is global across all stores you manage.
        </CardDescription>
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
                      <Input 
                        placeholder="Arnold" 
                        disabled={isUpdating} 
                        {...field} 
                      />
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
                      <Input 
                        placeholder="Saka" 
                        disabled={isUpdating} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                {/* Email is a unique identifier; changes should happen via a verified flow */}
                <Input readOnly disabled value={initialData?.email} className="bg-muted/50" />
              </FormControl>
              <p className="text-[11px] text-muted-foreground mt-1">
                Email cannot be changed directly for security reasons.
              </p>
            </FormItem>
          </CardContent>

          <CardFooter className="border-t px-6 py-4 bg-muted/10">
            <Button 
              type="submit" 
              disabled={isUpdating || !isDirty}
              className="min-w-[120px]"
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}