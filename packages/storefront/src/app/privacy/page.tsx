// REFACTOR: Privacy Policy page with optimized loading and caching

import { Suspense } from "react";
import { LegalContentService } from "@/services/legal-content.service";
import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";
import { LegalDocumentContent } from "@/components/legal/legal-document-content";
import { Skeleton } from "@/components/ui/skeleton";

// OPTIMIZATION: Async component for better performance
async function PrivacyPolicyContent() {
  const legalService = LegalContentService.getInstance();
  const document = await legalService.getDocument("privacy");
  const navigation = legalService.getNavigation("privacy");

  return (
    <LegalDocumentLayout document={document} navigation={navigation}>
      <LegalDocumentContent sections={document.sections} />
    </LegalDocumentLayout>
  );
}

// OPTIMIZATION: Loading skeleton for better UX
function PrivacyPolicySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<PrivacyPolicySkeleton />}>
      <PrivacyPolicyContent />
    </Suspense>
  );
}

// OPTIMIZATION: Metadata for SEO
export const metadata = {
  title: "Privacy Policy - Artisan Base",
  description:
    "Learn how Artisan Base collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
  keywords: "privacy policy, data protection, personal information, GDPR, CCPA",
};
