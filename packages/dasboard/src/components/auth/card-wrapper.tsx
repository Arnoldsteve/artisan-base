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

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
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
          <Button variant="link" className="w-full font-normal" asChild>
            <Link href={backButtonHref}>
                {backButtonLabel}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}