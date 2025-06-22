// In packages/web/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the access token cookie from the request
  const accessToken = request.cookies.get('access_token')?.value;

  // 2. Define which paths are considered "auth" pages (login, signup)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

  // 3. If the user is trying to access an auth page but is already logged in,
  //    redirect them to the dashboard.
  if (isAuthPage) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return null; // Allow them to see the login/signup page
  }

  // 4. If the user is trying to access any other page (e.g., /dashboard)
  //    but is NOT logged in, redirect them to the login page.
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. If they are logged in and not on an auth page, allow them to proceed.
  return null;
}

// See "Matching Paths" below to learn more
export const config = {
  // This matcher ensures the middleware runs on all routes EXCEPT
  // static assets, images, and special Next.js files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};