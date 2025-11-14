"use server"; 

import { cookies } from "next/headers";
import { BaseApiClient } from "./api-client.base"; 

/**
 * Creates a pre-configured, single-use Axios instance for server-side API calls.
 * It automatically reads the accessToken and tenant subdomain from the
 * incoming request's cookies and adds them as headers to the new client instance.
 * @returns A promise that resolves to a new, authenticated BaseApiClient instance.
 */
export const createServerApiClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const orgSubdomain = cookieStore.get("selectedOrgSubdomain")?.value;


  

  // Create a NEW, request-specific instance of the BASE client.
  // It has all the methods (get, post, delete, patch) and consistent
  // error handling that we need on the server.
  return new BaseApiClient(process.env.NEXT_PUBLIC_API_URL, {
    token,
    tenantId: orgSubdomain,
  });
};