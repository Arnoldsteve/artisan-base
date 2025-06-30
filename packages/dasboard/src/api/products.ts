// src/api/products.ts
import { apiClient } from './client';
import { CreateProductDto, UpdateProductDto, PaginatedProductsResponse } from '@/types/products.dto';
import { Product } from '@/types/products';
import { AxiosError } from 'axios';

function getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('User is not authenticated.');
    return { Authorization: `Bearer ${token}` };
}

const handleError = (error: unknown, defaultMessage: string) => {
    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || defaultMessage);
    }
    throw new Error(defaultMessage);
};

export async function getProducts(page = 1, limit = 10): Promise<PaginatedProductsResponse> {
    try {
        const response = await apiClient.get('/dashboard/products', {
            params: { page, limit },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        handleError(error, "Failed to fetch products.");
    }
};

export async function createProduct(productData: CreateProductDto): Promise<Product> {
    try {
        const response = await apiClient.post('/dashboard/products', productData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        handleError(error, "Failed to create product.");
    }
};

export async function updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    try {
        const response = await apiClient.patch(`/dashboard/products/${id}`, productData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        handleError(error, "Failed to update product.");
    }
};

export async function deleteProduct(id: string): Promise<void> {
    try {
        await apiClient.delete(`/dashboard/products/${id}`, {
            headers: getAuthHeader(),
        });
    } catch (error) {
        handleError(error, "Failed to delete product.");
    }
};