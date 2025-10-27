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
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-[450px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Your App</CardTitle>
          <CardDescription>{headerLabel}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
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
