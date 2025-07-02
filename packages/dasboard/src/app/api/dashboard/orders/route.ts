import { createServerApiClient } from "@/services/server-api";
import { NextResponse } from "next/server";

// GET all orders
export async function GET(request: Request) {
  try {
    const serverApi = await createServerApiClient();
    const response = await serverApi.get("/dashboard/orders");
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch orders." },
      { status: error.response?.status || 500 }
    );
  }
}

// POST (create) a new order
export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const serverApi = await createServerApiClient();
    const response = await serverApi.post("/dashboard/orders", orderData);
    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Login error:", error);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "An unexpected error occurred during login.";
    return NextResponse.json({ message }, { status });
  }
}
