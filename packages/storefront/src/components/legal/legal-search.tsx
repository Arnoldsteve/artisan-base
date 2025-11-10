'use client'

import { useState, useCallback, useMemo } from "react";
import { LegalSearchResult } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, FileText } from "lucide-react";
import Link from "next/link";

interface LegalSearchProps {
  onSearch: (query: string) => void;
  results?: LegalSearchResult[];
}

function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => callback(...args), delay);
      setTimeoutId(newTimeoutId);
    },
    [callback, delay, timeoutId]
  ) as T;
}

export function LegalSearch({ onSearch, results }: LegalSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // OPTIMIZATION: Debounced search to reduce API calls
  const debouncedSearch = useDebounce((searchQuery: string) => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      onSearch(searchQuery);
    }
  }, 300);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setIsSearching(false);
  }, []);

  // OPTIMIZATION: Memoized search results for better performance
  const searchResults = useMemo(() => {
    if (!results || results.length === 0) return null;

    return results.slice(0, 5).map((result, index) => (
      <Link
        key={`${result.documentId}-${result.sectionId}-${index}`}
        href={`/${result.documentId}#${result.sectionId}`}
        className="block p-3 hover:bg-muted rounded-lg transition-colors"
      >
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm text-foreground">
              {result.sectionTitle}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {result.documentTitle}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {result.matchedText}
            </div>
          </div>
        </div>
      </Link>
    ));
  }, [results]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Legal Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search policies..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="space-y-2">
            {searchResults ? (
              <>
                <div className="text-sm font-medium text-muted-foreground">
                  Search Results
                </div>
                <div className="space-y-1">{searchResults}</div>
                {results && results.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    Showing 5 of {results.length} results
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No results found
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-medium">Search Tips:</div>
          <div>• Use specific terms like "privacy", "cookies", "terms"</div>
          <div>• Minimum 2 characters required</div>
          <div>• Results update as you type</div>
        </div>
      </CardContent>
    </Card>
  );
}
