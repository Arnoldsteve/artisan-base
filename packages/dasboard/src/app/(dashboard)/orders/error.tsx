// src/app/dashboard/orders/error.tsx
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
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-[450px]">
            <CardHeader>
                <CardTitle>Something went wrong!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>An unexpected error occurred while loading the order data.</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => reset()}>
                    Try again
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}