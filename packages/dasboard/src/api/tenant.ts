// src/api/tenant.ts
import { apiClient } from './client';
import { CreateTenantDto, CreateTenantResponse, AvailabilityResponse } from '@/types/tenant';
import { AxiosError } from 'axios';

// Helper to get the auth token from localStorage
function getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // This will be caught by the calling function's try/catch block
        throw new Error('Authentication token not found. Please log in again.');
    }
    return { Authorization: `Bearer ${token}` };
}

/**
 * Checks if a subdomain is available by calling the real backend endpoint.
 */
export async function checkSubdomainAvailability(subdomain: string): Promise<AvailabilityResponse> {
    try {
        const response = await apiClient.get('/tenants/availability', {
            params: { subdomain }, 
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message || "Could not check subdomain availability.");
        }
        throw new Error("An unexpected network error occurred.");
    }
}

/**
 * Creates a new tenant (organization).
 */
export async function createTenant(tenantData: CreateTenantDto): Promise<CreateTenantResponse> {
    try {
        const response = await apiClient.post('/tenants', tenantData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message || 'Failed to create organization.');
        }
        throw new Error('An unexpected error occurred during organization creation.');
    }
}