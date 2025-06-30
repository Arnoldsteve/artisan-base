// packages/dashboard/src/app/api/dashboard/orders/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { createServerApiClient } from '@/api/server-api';

// PATCH to update order status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const serverApi = await createServerApiClient();
    const response = await serverApi.patch(`/dashboard/orders/${params.id}/status`, { status });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data?.message || 'Failed to update status.' }, { status: error.response?.status || 500 });
  }
}