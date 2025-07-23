import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Creates a pre-configured Axios instance for server-side use.
 * It automatically reads the accessToken and tenant subdomain from the
 * incoming request's cookies and adds them as headers.
 * 
 * This function itself must be async to use await.
 */
export async function createServerApiClient() {
  console.log("createServerApiClient called");

  const cookieStore = await cookies();
    git
  const token = cookieStore.get('accessToken')?.value;
  const orgSubdomain = cookieStore.get('selectedOrgSubdomain')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (orgSubdomain) {
    headers['x-tenant-id'] = orgSubdomain;
  }
  
  const instance = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers,
  });

  return instance;
}