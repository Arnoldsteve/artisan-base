// REFACTOR: Comprehensive legal search page with advanced functionality

"use client";

import { useState, useEffect } from "react";
import { LegalContentService } from "@/services/legal-content.service";
import { LegalSearchResult, LegalNavigation } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  FileText,
  Shield,
  Cookie,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function LegalSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LegalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    "privacy",
    "terms",
    "cookies",
  ]);
  const [sortBy, setSortBy] = useState<"relevance" | "document" | "section">(
    "relevance"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const legalService = LegalContentService.getInstance();
  const navigation = legalService.getNavigation("legal-search");

  // OPTIMIZATION: Debounced search for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedDocuments]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const searchResults = await legalService.searchContent(query);
      const filteredResults = searchResults.filter((result) =>
        selectedDocuments.includes(result.documentId)
      );

      const sortedResults = sortResults(filteredResults);
      setResults(sortedResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // OPTIMIZATION: Efficient sorting algorithm
  const sortResults = (results: LegalSearchResult[]): LegalSearchResult[] => {
    return [...results].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "relevance":
          comparison = b.relevance - a.relevance;
          break;
        case "document":
          comparison = a.documentTitle.localeCompare(b.documentTitle);
          break;
        case "section":
          comparison = a.sectionTitle.localeCompare(b.sectionTitle);
          break;
      }

      return sortOrder === "desc" ? comparison : -comparison;
    });
  };

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const getDocumentIcon = (documentId: string) => {
    switch (documentId) {
      case "privacy":
        return Shield;
      case "terms":
        return FileText;
      case "cookies":
        return Cookie;
      default:
        return FileText;
    }
  };

  const getDocumentColor = (documentId: string) => {
    switch (documentId) {
      case "privacy":
        return "bg-blue-100 text-blue-800";
      case "terms":
        return "bg-green-100 text-green-800";
      case "cookies":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Legal Document Search
            </h1>
          </div>
          <p className="text-muted-foreground">
            Search across all our legal documents to find specific information
            quickly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search legal documents..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isSearching && (
                  <div className="text-sm text-muted-foreground text-center">
                    Searching...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {navigation.pages.map((page) => {
                  const Icon = getDocumentIcon(page.id);
                  const isSelected = selectedDocuments.includes(page.id);

                  return (
                    <label
                      key={page.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleDocumentToggle(page.id)}
                        className="rounded"
                      />
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{page.title}</span>
                    </label>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sort Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SortAsc className="h-5 w-5" />
                  Sort By
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort Field</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="document">Document</option>
                    <option value="section">Section</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <div className="flex gap-2">
                    <Button
                      variant={sortOrder === "desc" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortOrder("desc")}
                    >
                      <SortDesc className="h-4 w-4 mr-1" />
                      Desc
                    </Button>
                    <Button
                      variant={sortOrder === "asc" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortOrder("asc")}
                    >
                      <SortAsc className="h-4 w-4 mr-1" />
                      Asc
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Search Results
                </h2>
                {query && (
                  <p className="text-muted-foreground">
                    {results.length} result{results.length !== 1 ? "s" : ""} for
                    "{query}"
                  </p>
                )}
              </div>

              {results.length > 0 && (
                <Badge variant="secondary">
                  {selectedDocuments.length} document
                  {selectedDocuments.length !== 1 ? "s" : ""} selected
                </Badge>
              )}
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {results.length === 0 && query && !isSearching ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or document filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                results.map((result, index) => {
                  const Icon = getDocumentIcon(result.documentId);
                  const colorClass = getDocumentColor(result.documentId);

                  return (
                    <Card
                      key={`${result.documentId}-${result.sectionId}-${index}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Icon className="h-6 w-6 text-muted-foreground" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {result.sectionTitle}
                              </h3>
                              <Badge className={colorClass}>
                                {result.documentTitle}
                              </Badge>
                            </div>

                            <p className="text-muted-foreground mb-3">
                              {result.matchedText}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                Relevance: {Math.round(result.relevance * 100)}%
                              </span>
                              <span>•</span>
                              <span>{result.documentTitle}</span>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <Link
                              href={`/${result.documentId}#${result.sectionId}`}
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              View Section
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Search Tips */}
            {!query && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-lg">Search Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-medium mb-2">
                        Effective Search Terms
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          • Use specific terms like "privacy", "cookies",
                          "terms"
                        </li>
                        <li>
                          • Include legal concepts like "GDPR", "CCPA",
                          "liability"
                        </li>
                        <li>
                          • Search for processes like "returns", "refunds",
                          "shipping"
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Advanced Features</h4>
                      <ul className="space-y-1">
                        <li>• Filter by specific documents</li>
                        <li>• Sort by relevance, document, or section</li>
                        <li>
                          • Click "View Section" to jump directly to content
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
