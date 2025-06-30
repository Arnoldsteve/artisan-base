import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import type { SignUpResponse } from '@/types/auth';

const NESTJS_API_URL = 'http://localhost:3001/api/v1';

export async function POST(request: Request) {
  try {
    const signUpData = await request.json();

    const response = await axios.post<SignUpResponse>(
      `${NESTJS_API_URL}/auth/signup`,
      signUpData
    );

    const { accessToken } = response.data;
    console.log('Sign-up response:', response.data);

    if (accessToken) {
      const cookieStore = await cookies(); 
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, 
      });
    }

    return NextResponse.json(response.data);

  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'An unexpected error occurred during sign-up.';
    return NextResponse.json({ message }, { status });
  }
}