// src/api/products.ts
import axios, { AxiosError } from "axios";
import {
  CreateProductDto,
  UpdateProductDto,
  PaginatedProductsResponse,
} from "@/types/products.dto";
import { Product } from "@/types/products";

// Use the consistent BFF client pattern
const bffApi = axios.create({
  baseURL: "/api", // Points to our /app/api folder
});

// A consistent error handler for this module
const handleError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError && error.response) {
    throw new Error(error.response.data.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

// This function now supports search!
export async function getProducts(
  page = 1,
  limit = 10,
  search?: string
): Promise<PaginatedProductsResponse> {
  try {
    const params = {
      page,
      limit,
      search: search || undefined,
    };
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    console.log("Fetching products with params:", cleanedParams);

    // Calls GET /api/dashboard/products with pagination and optional search
    const response = await bffApi.get("/dashboard/products", {
      params: cleanedParams,
    });
    console.log("Products fetched:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch products.");
  }
}

export async function createProduct(
  productData: CreateProductDto
): Promise<Product> {
  try {
    // Calls POST /api/dashboard/products
    const response = await bffApi.post("/dashboard/products", productData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create product.");
  }
}

export async function updateProduct(
  id: string,
  productData: UpdateProductDto
): Promise<Product> {
  try {
    // Calls PATCH /api/dashboard/products/{id}
    const response = await bffApi.patch(
      `/dashboard/products/${id}`,
      productData
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update product.");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    // Calls DELETE /api/dashboard/products/{id}
    await bffApi.delete(`/dashboard/products/${id}`);
  } catch (error) {
    handleError(error, "Failed to delete product.");
  }
}

// DEPRECATED: API logic moved to services/product-repository.ts for SRP and testability.
export * from "@/types/products";
export * from "@/types/products.dto";
