import { createServerApiClient } from '@/services/server-api';
import { NextResponse } from 'next/server';

// GET all products (with search and pagination)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverApi = await createServerApiClient();

    const apiParams = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
    };
    
    const cleanedParams = Object.fromEntries(Object.entries(apiParams).filter(([_, v]) => v !== undefined));

    const response = await serverApi.get('/dashboard/products', {
      params: cleanedParams,
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch products.';
    return NextResponse.json({ message }, { status });
  }
}

// POST (create) a new product
export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const serverApi = await createServerApiClient();
    const response = await serverApi.post('/dashboard/products', productData);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to create product.';
    return NextResponse.json({ message }, { status });
  }
}