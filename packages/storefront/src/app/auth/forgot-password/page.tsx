import React from "react";
import Link from "next/link";
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { Info, ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export default function page() {
  return (
    <div className="bg-muted min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert className="border-blue-500 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            This feature is currently in progress and will be available soon.
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className=" text-blue-500 hover:text-blue-600"
              // className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
