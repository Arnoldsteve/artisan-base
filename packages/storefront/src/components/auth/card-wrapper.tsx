"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import React from "react";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref?: string;
  backButtonAction?: () => void;
}

export function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  backButtonAction,
}: CardWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40  sm:px-0">
      <Card className="w-full max-w-[300px] sm:max-w-[420px] md:max-w-[450px] shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-blue-500">
            Artisan Base
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            {headerLabel}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">{children}</CardContent>

        <CardFooter className="px-4 sm:px-6">
          {backButtonHref ? (
            <Button variant="link" className="w-full font-normal" asChild>
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          ) : (
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
