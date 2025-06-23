
// 1. Check if we are running on the server or client
const isServer = typeof window === 'undefined';

// 2. Define the base URL based on the environment
const API_BASE_URL = isServer
  ? 'http://localhost:3001' // Use the absolute URL for the backend on the server
  : '/api'; // Use the relative proxy path on the client

export async function signupUser(data: any) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Handle errors, e.g., by throwing an error with the response body
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to sign up');
  }

  return response.json();
}

export async function loginUser(data: any) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // We need to handle both successful and error responses
  const responseData = await response.json();

  if (!response.ok) {
    // The API returns error details in the response body
    throw new Error(responseData.message || 'Failed to login');
  }

  return responseData; // This will be the object with the access_token
}

export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch profile');
  }

  return responseData; // This will be the user object
}

export async function createStore(data: { id: string; name: string }) {
  const response = await fetch(`${API_BASE_URL}/stores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to create store');
  }
  return responseData;
}

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  // ... error handling ...
  return response.json();
}

export async function createProduct(data: any) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  // ... error handling ...
  return response.json();
}

export async function updateProduct(productId: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  // ... error handling ...
  return response.json();
}

export async function deleteProduct(productId: string) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (response.status !== 204) { // Check for 204 No Content
    // Handle potential errors if needed
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete product');
  }
  // No need to return response.json() for a 204 response
  return;
}

export async function getPublicStoreProducts(storeId: string) {
  // We directly fetch from the proxied API route
  const response = await fetch(`${API_BASE_URL}/public/stores/${storeId}/products`);

  // We need to handle the case where a store doesn't exist (404 Not Found)
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Return null to indicate the store was not found
    }
    // For other errors, we can throw
    throw new Error('Failed to fetch store products');
  }

  return response.json();
}