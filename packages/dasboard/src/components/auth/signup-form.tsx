import { Button, Input, Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';

export function SignupForm() {
  return (
    <CardWrapper
      headerLabel="Create an account to get started."
      backButtonLabel="Already have an account? Login"
      backButtonHref="/"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </div>
    </CardWrapper>
  );
}