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
    <div className="p-4 md-p-8 lg-p-10">
      <PageHeader
        title="User Profile"
        description="View and update your profile information"
      />
      <ProfileSettings user={user} />
    </div>
  );
}
