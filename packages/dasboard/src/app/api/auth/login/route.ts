import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import type { LoginResponse } from "@/types/auth";

const NESTJS_API_URL = "http://localhost:3001/api/v1";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await axios.post<LoginResponse>(
      `${NESTJS_API_URL}/auth/login`,
      { email, password }
    );

    const { accessToken, organizations } = response.data;

    if (!accessToken) {
      throw new Error("Authentication failed: No token received from API.");
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    if (organizations && organizations.length > 0) {
      const activeOrg = organizations[0];
      cookieStore.set("selectedOrgSubdomain", activeOrg.subdomain, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({
      success: true,
      hasOrganizations: organizations && organizations.length > 0,
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "An unexpected error occurred during login.";
    return NextResponse.json({ message }, { status });
  }
}
