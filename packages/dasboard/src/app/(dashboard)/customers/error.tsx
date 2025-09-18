'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@repo/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-[450px]">
            <CardHeader>
                <CardTitle>Something went wrong!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>An unexpected error occurred while loading the product data. You can try again.</p>
                {/* For debugging, you can uncomment this in development */}
                <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </CardContent>
            <CardFooter>
                 <Button
                    onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                    }
                >
                    Try again
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}