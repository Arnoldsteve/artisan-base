import { createServerApiClient } from "@/services/server-api";
import { NextResponse } from "next/server";

// GET a single order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const serverApi = await createServerApiClient();
    // Forward all headers from the incoming request
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    const response = await serverApi.get(`/dashboard/orders/${params.id}`, {
      headers,
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Order detail fetch failed for id ${params.id}:`, error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch order." },
      { status: error.response?.status || 500 }
    );
  }
}

// DELETE an order by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const serverApi = await createServerApiClient();
    await serverApi.delete(`/dashboard/orders/${params.id}`);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to delete order." },
      { status: error.response?.status || 500 }
    );
  }
}
