"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileInfoForm } from "./components/profile-info-form";
import { ChangePasswordForm } from "./components/change-password-form";

export default function SettingsPage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-muted-foreground">
        Could not load profile information.
      </p>
    );
  }

  return (
    <>
      <PageHeader title={`${user?.firstName} ${user?.lastName}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 md:p-8 lg:p-10">
        <ProfileInfoForm initialData={user} />
        <ChangePasswordForm />
      </div>
    </>
  );
}
