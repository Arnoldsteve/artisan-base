import { NextResponse } from 'next/server';
import { createServerApiClient } from '@/api/server-api';

// PATCH (update) a product by ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json();
    const serverApi = await createServerApiClient();
    const response = await serverApi.patch(`/dashboard/products/${params.id}`, productData);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to update product.';
    return NextResponse.json({ message }, { status });
  }
}

// DELETE a product by ID
export async function DELETE(request: Request, { params }: { params: { id:string } }) {
  try {
    const serverApi = await createServerApiClient();
    await serverApi.delete(`/dashboard/products/${params.id}`);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to delete product.';
    return NextResponse.json({ message }, { status });
  }
}