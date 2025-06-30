// packages/dashboard/src/app/api/dashboard/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { createServerApiClient } from '@/api/server-api';

// GET a single order by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const serverApi = await createServerApiClient();
    const response = await serverApi.get(`/dashboard/orders/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data?.message || 'Failed to fetch order.' }, { status: error.response?.status || 500 });
  }
}

// DELETE an order by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const serverApi = await createServerApiClient();
    await serverApi.delete(`/dashboard/orders/${params.id}`);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data?.message || 'Failed to delete order.' }, { status: error.response?.status || 500 });
  }
}