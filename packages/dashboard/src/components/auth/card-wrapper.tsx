"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@repo/ui';
import { Button } from '@repo/ui';
import Link from 'next/link';
import React from 'react';

// --- 1. UPDATE THE PROPS INTERFACE ---
interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  // Make `href` optional
  backButtonHref?: string;
  // Add an optional `action` prop
  backButtonAction?: () => void;
}

export function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  backButtonAction, // Receive the new prop
}: CardWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-[450px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Your App</CardTitle>
          <CardDescription>{headerLabel}</CardDescription>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        <CardFooter>
          {/* --- 2. ADD THE CONDITIONAL LOGIC --- */}
          {backButtonHref ? (
            // If an href is provided, render the Link
            <Button variant="link" className="w-full font-normal" asChild>
              <Link href={backButtonHref}>
                {backButtonLabel}
              </Link>
            </Button>
          ) : (
            // Otherwise, render a Button with the onClick action
            <Button 
              variant="link" 
              className="w-full font-normal" 
              onClick={backButtonAction}
            >
              {backButtonLabel}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}