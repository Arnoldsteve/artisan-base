import axios from "axios";
import Cookies from "js-cookie";

export async function refreshAccessToken(): Promise<string | null> {
  try {
    // Get refresh token from cookies
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      console.error("No refresh token found in cookies");
      return null;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/auth/refresh`,
      { refreshToken }, // ✅ Send refresh token in body
      { withCredentials: true }
    );

    console.log("Refresh response data:", response.data);

    // Store new tokens
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) {
      Cookies.set('accessToken', accessToken, { 
        expires: 1, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' 
      });
    }

    if (newRefreshToken) {
      Cookies.set('refreshToken', newRefreshToken, { 
        expires: 30, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' 
      });
    }

    return accessToken ?? null;
  } catch (err: any) {
    console.error("Failed to refresh access token:", err.response?.data || err);
    
    // If refresh fails, clear tokens and redirect to login
    if (err.response?.status === 401 || err.response?.status === 403) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('selectedOrgSubdomain');
      // Optional: redirect to login
      // window.location.href = '/login';
    }
    
    return null;
  }
}