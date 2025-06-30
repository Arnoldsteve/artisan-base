import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add interceptors here later to automatically attach the auth token.