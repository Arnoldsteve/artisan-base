// "use client";

import { PageHeader } from "@/components/shared/page-header";
import { useAuthContext } from "@/contexts/auth-context";
import { SettingsPageContent } from "./components/profile-settings-page";

export default function SettingsPage() {

  return (
    <>
      <PageHeader title="User Profile" />
      <div className="px-8 space-y-4">
        <SettingsPageContent />
      </div>
    </>
  );
}
