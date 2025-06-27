// Notice all UI imports are from '@repo/ui'
import { Button, Input, Label } from '@repo/ui';
import { CardWrapper } from './card-wrapper';

export function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Welcome back! Please sign in."
      backButtonLabel="Don't have an account? Sign Up"
      backButtonHref="/signup"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </CardWrapper>
  );
}