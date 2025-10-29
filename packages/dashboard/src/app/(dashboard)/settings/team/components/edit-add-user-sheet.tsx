"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import {
  inviteMemberSchema,
  DashboardUserFormData,
} from "@/validation-schemas/dashboardUserSchema";
import { DashboardUserRole } from "@/types/roles";
import { DashboardUser } from "@/types/users";

interface EditAddUserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardUser: Partial<DashboardUser> | null;
  onSave: (dashboardUser: DashboardUser) => void;
  isPending?: boolean;
}

export function EditAddUserSheet({
  isOpen,
  onClose,
  dashboardUser,
  onSave,
  isPending,
}: EditAddUserSheetProps) {
  const isNewDashboardUser = !dashboardUser?.id;

  const form = useForm<DashboardUserFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: DashboardUserRole.VIEWER,
    },
  });

  // populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (dashboardUser) {
        form.reset({
          id: dashboardUser.id,
          email: dashboardUser.email,
          password: dashboardUser.password,
          firstName: dashboardUser.lastName,
          lastName: dashboardUser.lastName,
          role: dashboardUser.role,
          isActive: dashboardUser.isActive,
        });
      } else {
        form.reset({
          id: undefined,
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: DashboardUserRole.STAFF,
          isActive: true,
        });
      }
    }
  }, [dashboardUser, isOpen, form]);

  const onSubmit = (data: DashboardUserFormData) => {
    onSave(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isNewDashboardUser ? "Invite New User" : " Edit User"}
          </SheetTitle>
          <SheetDescription>
            {isNewDashboardUser
              ? "Enter the user's name, email and assign a role."
              : "Update the user's info and role."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gape-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
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
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Intial */}

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(DashboardUserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() +
                            role.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : isNewDashboardUser
                    ? "Send Invite"
                    : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
