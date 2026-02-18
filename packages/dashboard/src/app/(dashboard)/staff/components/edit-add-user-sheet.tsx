"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  StaffMemberSchema,
  StaffMemberFormData,
} from "@/validation-schemas/staffMemberSchema";
import { TenantUserRole } from "@/types/roles";
import { StaffMember } from "@/types/staff";
import { capitalizeFirstLetter } from "@/utils/string-utils";

interface EditAddUserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember: StaffMember | null;
  onSave: (data: StaffMemberFormData) => void;
  isPending?: boolean;
}

export function EditAddUserSheet({
  isOpen,
  onClose,
  staffMember,
  onSave,
  isPending,
}: EditAddUserSheetProps) {
  const isEditing = !!staffMember?.id;

  const form = useForm<StaffMemberFormData>({
    resolver: zodResolver(StaffMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: TenantUserRole.STAFF,
      isActive: true,
    },
  });

  // Populate form when editing or clear when adding
  useEffect(() => {
    if (isOpen) {
      if (staffMember) {
        form.reset({
          id: staffMember.id,
          // ✅ Mapping nested user data to flat form fields
          email: staffMember.user.email,
          firstName: staffMember.user.firstName || "",
          lastName: staffMember.user.lastName || "",
          role: staffMember.role,
          isActive: staffMember.isActive,
          password: "", // Never populate password field
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: TenantUserRole.STAFF,
          isActive: true,
        });
      }
    }
  }, [staffMember, isOpen, form]);

  const onSubmit = (data: StaffMemberFormData) => {
    onSave(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {!isEditing ? "Invite Staff Member" : "Update Staff Role"}
          </SheetTitle>
          <SheetDescription>
            {!isEditing
              ? "Send an invite to a new team member to join your store."
              : "Change permissions or status for this staff member."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                        disabled={isPending || isEditing} // Names usually managed by user profile
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
                        placeholder="Doe"
                        {...field}
                        onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                        disabled={isPending || isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="staff@artisan.com"
                      {...field}
                      disabled={isPending || isEditing} // ✅ Disable email on edit
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Min 8 characters"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Role</FormLabel>
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
                      {Object.values(TenantUserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-6">
              <SheetClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending
                  ? "Processing..."
                  : !isEditing
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