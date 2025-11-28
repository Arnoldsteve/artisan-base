"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileInfoForm } from "./components/profile-info-form";
import { ChangePasswordForm } from "./components/change-password-form";

export default function SettingsPage() {
  const { user } = useAuthContext();

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-2 lg:px-4 md:mt-0 md:pb-10">
        <ProfileInfoForm initialData={user} />
        <ChangePasswordForm />
      </div>
    </>
  );
}
