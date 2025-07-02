// packages/dashboard/src/app/api/tenants/availability/route.ts
import { createServerApiClient } from '@/services/server-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Get the subdomain from the URL's query parameters
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json({ message: 'Subdomain parameter is required.' }, { status: 400 });
    }
    
    // 2. Create the authenticated client
    const serverApi = await createServerApiClient();

    // 3. Forward the request to the real NestJS backend
    const response = await serverApi.get('/tenants/availability', {
      params: { subdomain },
    });
    
    // 4. Return the successful response
    return NextResponse.json(response.data);

  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Could not check availability.';
    return NextResponse.json({ message }, { status });
  }
}