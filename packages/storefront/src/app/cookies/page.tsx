import { Suspense } from "react";
import { LegalContentService } from "@/services/legal-content.service";
import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";
import { LegalDocumentContent } from "@/components/legal/legal-document-content";
import { Skeleton } from "@/components/ui/skeleton";

async function CookiePolicyContent() {
  const legalService = LegalContentService.getInstance();
  const document = await legalService.getDocument("cookies");
  const navigation = legalService.getNavigation("cookies");

  return (
    <LegalDocumentLayout document={document} navigation={navigation}>
      <LegalDocumentContent sections={document.sections} />
    </LegalDocumentLayout>
  );
}

function CookiePolicySkeleton() {
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

export default function CookiePolicyPage() {
  return (
    <Suspense fallback={<CookiePolicySkeleton />}>
      <CookiePolicyContent />
    </Suspense>
  );
}

export const metadata = {
  title: "Cookie Policy - Artisan Base",
  description:
    "Learn how Artisan Base uses cookies and similar technologies to enhance your browsing experience.",
  keywords:
    "cookie policy, cookies, tracking technologies, browser settings, privacy",
};
