import Link from 'next/link';
// Imports are from our shared UI package!
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@repo/ui';

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
    <Card className="w-[400px] shadow-lg">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-3xl font-semibold">ArtisanBase</h1>
          <p className="text-muted-foreground text-sm">{headerLabel}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}