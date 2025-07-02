import axios, { AxiosError } from "axios";
import {
  CreateProductDto,
  UpdateProductDto,
  PaginatedProductsResponse,
} from "@/types/products.dto";
import { Product } from "@/types/products";

const bffApi = axios.create({
  baseURL: "/api",
});

const handleError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError && error.response) {
    throw new Error(error.response.data.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

export class ProductRepository {
  static async getProducts(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedProductsResponse> {
    try {
      const params = { page, limit, search: search || undefined };
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      );
      const response = await bffApi.get("/dashboard/products", {
        params: cleanedParams,
      });
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch products.");
    }
  }

  static async createProduct(productData: CreateProductDto): Promise<Product> {
    try {
      const response = await bffApi.post("/dashboard/products", productData);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to create product.");
    }
  }

  static async updateProduct(
    id: string,
    productData: UpdateProductDto
  ): Promise<Product> {
    try {
      const response = await bffApi.patch(
        `/dashboard/products/${id}`,
        productData
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update product.");
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      await bffApi.delete(`/dashboard/products/${id}`);
    } catch (error) {
      handleError(error, "Failed to delete product.");
    }
  }
}
// REFACTOR: Centralized all product API calls for SRP, DRY, and testability.
