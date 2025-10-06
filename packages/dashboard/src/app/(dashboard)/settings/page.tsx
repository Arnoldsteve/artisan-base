"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ProfileSettings } from "./components/profile-settings-page";
import { useAuthContext } from "@/contexts/auth-context";

export default function SettingsPage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Could not load profile information.</p>;
  }

  return (
    <>
      <PageHeader title="User Profile" />
      <div className="px-8 space-y-4">
        <ProfileSettings user={user} />
      </div>
    </>
  );
}
