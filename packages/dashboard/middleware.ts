// In packages/web/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Define your main application's host (for dashboard, login, etc.)
  // In development, this might be localhost:3000. In production, it would be 'app.artisanbase.com'.
  // We'll use a simple check for localhost for now.
  const isAppHostname = hostname.includes('localhost'); // Adjust for production

  const accessToken = request.cookies.get('access_token')?.value;

  // Extract the potential subdomain
  const subdomain = hostname.split('.')[0];
  const isStoreSubdomain = !isAppHostname && subdomain !== 'www';

  // --- Main App Logic (Dashboard, Login) ---
  if (isAppHostname) {
    const isAuthPage = url.pathname.startsWith('/login');

    if (isAuthPage) {
      return accessToken ? NextResponse.redirect(new URL('/dashboard', request.url)) : null;
    }

    if (!accessToken && url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  // --- Public Storefront Logic ---
  if (isStoreSubdomain) {
    // Rewrite the URL to our dynamic route, passing the subdomain as a parameter
    // e.g., 'malaikabeads.localhost:3000' becomes '/malaikabeads'
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};