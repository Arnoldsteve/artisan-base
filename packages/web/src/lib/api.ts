
// const API_BASE_URL = 'http://localhost:3001'; 
const API_BASE_URL = '/api'; 

// We can add functions here for signup, login, etc.
// For example:
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

// In packages/web/src/lib/api.ts
// ...

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