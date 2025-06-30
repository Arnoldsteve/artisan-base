import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the cookies by setting their maxAge to a past date
    cookieStore.set('accessToken', '', { httpOnly: true, path: '/', maxAge: -1 });
    cookieStore.set('selectedOrgSubdomain', '', { httpOnly: true, path: '/', maxAge: -1 });

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred during logout.' }, { status: 500 });
  }
}