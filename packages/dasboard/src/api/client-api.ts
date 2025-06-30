// src/api/client-api.ts
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// IMPORTANT: This client is now ONLY for UNSECURED, client-side requests.
// For any request that requires authentication, you must use a Server Action
// or a Route Handler which can access the HttpOnly cookies on the server.
export const clientApi = axios.create({
  baseURL: `${API_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});


// The global error handler is still useful for any requests made with this client.
clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data.message || 'An error occurred.';
      // We check if a toast hasn't already been shown by a component's catch block
      if (error.config && !(error.config as any)._toastShown) {
        toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);