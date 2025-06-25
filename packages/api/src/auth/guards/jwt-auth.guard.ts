// In src/auth/guards/jwt-auth.guard.ts
import { Injectable, Scope, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable({ scope: Scope.REQUEST }) // <--- ADD SCOPE.REQUEST
export class JwtAuthGuard extends AuthGuard('jwt') {
  // You might need to add this constructor if you face issues with request context
  // in more complex scenarios, but often just adding the scope is enough.
  constructor() {
    super();
  }
}