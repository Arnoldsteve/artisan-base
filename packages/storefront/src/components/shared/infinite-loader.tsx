"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfiniteLoaderProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string; // Standardize distance to trigger (default 400px)
  className?: string;
  loadingMessage?: string;
  endMessage?: string;
}

/**
 * 🚀 TOP 1% ARCHITECTURE: Standardized Intersection Observer
 * Use this at the bottom of any list to trigger infinite scrolling.
 */
export function InfiniteLoader({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "400px",
  className,
  loadingMessage = "Loading more treasures...",
  endMessage = "You've reached the end of the collection.",
}: InfiniteLoaderProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Safety check for 1M users: prevents multiple observers firing at once
    if (!loaderRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, rootMargin]);

  return (
    <div ref={loaderRef} className={cn("py-12 flex flex-col items-center justify-center", className)}>
      {isFetchingNextPage ? (
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingMessage}
        </div>
      ) : hasNextPage ? (
        // Invisible div while not loading to maintain observer trigger
        <div className="h-4 w-full" />
      ) : (
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic opacity-60">
          {endMessage}
        </p>
      )}
    </div>
  );
}