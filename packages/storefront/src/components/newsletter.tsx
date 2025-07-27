// REFACTOR: Newsletter component with performance optimizations

"use client";

import { memo, useState, useCallback } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { useNewsletter } from "@/hooks/useNewsletter";


export const Newsletter = memo(function Newsletter() {
  const {
    email,
    isSubmitting,
    handleEmailChange,
    handleSubmit
  } = useNewsletter();


  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary-foreground/80" />
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-primary-foreground/80 text-lg">
              Be the first to discover new artisans, exclusive collections, and
              special offers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 focus:border-transparent disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-primary-foreground/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
});
