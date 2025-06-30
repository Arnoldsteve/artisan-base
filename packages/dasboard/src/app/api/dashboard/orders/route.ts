// packages/dashboard/src/app/api/dashboard/orders/route.ts
import { NextResponse } from 'next/server';
import { createServerApiClient } from '@/api/server-api';

// GET all orders
export async function GET(request: Request) {
  try {
    const serverApi = await createServerApiClient();
    const response = await serverApi.get('/dashboard/orders');
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data?.message || 'Failed to fetch orders.' }, { status: error.response?.status || 500 });
  }
}

// POST (create) a new order
export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const serverApi = await createServerApiClient();
    const response = await serverApi.post('/dashboard/orders', orderData);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data?.message || 'Failed to create order.' }, { status: error.response?.status || 500 });
  }
}