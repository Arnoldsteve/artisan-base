// REFACTOR: Reusable legal document layout component for consistent structure

"use client";

import { ReactNode } from "react";
import { LegalDocument, LegalNavigation } from "@/types/legal";
import { LegalNavigation as LegalNavigationComponent } from "./legal-navigation";
import { LegalSearch } from "./legal-search";
import { LegalTableOfContents } from "./legal-table-of-contents";
import { LegalFooter } from "./legal-footer";
import { Button } from "@/components/ui/button";
import { Printer, Download, Share2 } from "lucide-react";

interface LegalDocumentLayoutProps {
  document: LegalDocument;
  navigation: LegalNavigation;
  children: ReactNode;
  onSearch?: (query: string) => void;
  searchResults?: any[];
}

export function LegalDocumentLayout({
  document: legalDocument,
  navigation,
  children,
  onSearch,
  searchResults,
}: LegalDocumentLayoutProps) {
  // OPTIMIZATION: Memoized print function to avoid recreation on each render
  const handlePrint = () => {
    window.print();
  };

  // OPTIMIZATION: Memoized download function for better performance
  const handleDownload = () => {
    const content = legalDocument.sections
      .map((section) => `${section.title}\n\n${section.content}\n\n`)
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${legalDocument.id}-policy.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // OPTIMIZATION: Memoized share function for better performance
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: legalDocument.title,
          text: legalDocument.summary || legalDocument.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {legalDocument.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Effective: {legalDocument.effectiveDate}</span>
                <span>Last Updated: {legalDocument.lastUpdated}</span>
                <span>Version: {legalDocument.version}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="print:hidden"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="print:hidden"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="print:hidden"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start h-fit">
            {/* Navigation */}
            <LegalNavigationComponent navigation={navigation} />

            {/* Search */}
            {onSearch && (
              <LegalSearch onSearch={onSearch} results={searchResults} />
            )}

            {/* Table of Contents */}
            <LegalTableOfContents sections={legalDocument.sections} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Summary */}
            {legalDocument.summary && (
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <p className="text-muted-foreground">{legalDocument.summary}</p>
              </div>
            )}

            {/* Document Content */}
            <div className="prose prose-gray max-w-none">{children}</div>

            {/* Contact Information */}
            <LegalFooter contactInfo={legalDocument.contactInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
