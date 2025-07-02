// packages/dashboard/src/app/api/tenants/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerApiClient } from '@/services/server-api';

export async function POST(request: Request) {
  try {
    // 1. Get the data for the new tenant from the client's request
    const tenantData = await request.json();
    
    // 2. Create the authenticated API client. This reads the cookie and adds the auth header.
    const serverApi = await createServerApiClient();

    // 3. Forward the request to the real NestJS backend
    const response = await serverApi.post('/tenants', tenantData);

    // 4. IMPORTANT UX: After creating the org, automatically select it for the user
    // by setting the `selectedOrgSubdomain` cookie.
    const newTenant = response.data;
    if (newTenant?.subdomain) {
      (await cookies()).set('selectedOrgSubdomain', newTenant.subdomain, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    
    // 5. Return the successful response to the client form
    return NextResponse.json(newTenant);

  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to create organization.';
    return NextResponse.json({ message }, { status });
  }
}