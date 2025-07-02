
import { createServerApiClient } from "@/services/server-api";
import { NextResponse } from "next/server";

// PATCH (update) a product by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productData = await request.json();
    const serverApi = await createServerApiClient();
    // Forward all headers from the incoming request
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    const response = await serverApi.patch(
      `/dashboard/products/${params.id}`,
      productData,
      { headers }
    );
    console.log("product response", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Failed to update product.";
    return NextResponse.json({ message }, { status });
  }
}

// DELETE a product by ID
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const serverApi = await createServerApiClient();
//     await serverApi.delete(`/dashboard/products/${params.id}`);
//     return new NextResponse(null, { status: 204 });
//   } catch (error: any) {
//     const status = error.response?.status || 500;
//     const message = error.response?.data?.message || "Failed to delete product.";
//     return NextResponse.json({ message }, { status });
//   }
// }

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    console.log("=== DELETE route called ===");
    console.log("ID received:", params.id);
    console.log("Request URL:", request.url);
    
    try {
      const serverApi = await createServerApiClient();
      console.log("About to call backend DELETE");
      await serverApi.delete(`/dashboard/products/${params.id}`);
      console.log("Backend DELETE successful");
      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      console.error("DELETE error:", error);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to delete product.";
      return NextResponse.json({ message }, { status });
    }
  }
