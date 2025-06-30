// src/api/client.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THIS IS THE NEW, CRUCIAL PART ---
// Use an interceptor to dynamically add headers to every outgoing request.
apiClient.interceptors.request.use(
  (config) => {
    // This function will run before each request is sent.

    // 1. Get the authentication token from localStorage.
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If the token exists, add it to the Authorization header.
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Get the selected organization's subdomain from localStorage.
    const orgSubdomain = localStorage.getItem('selectedOrgSubdomain');
    if (orgSubdomain) {
      // Add it as a custom header. 'x-tenant-id' is a common convention.
      config.headers['x-tenant-id'] = orgSubdomain;
    }
    
    // Return the modified config object for the request to proceed.
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);