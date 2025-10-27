
'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@repo/ui/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
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
                <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </CardContent>
            <CardFooter>
                 <Button
                    onClick={
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