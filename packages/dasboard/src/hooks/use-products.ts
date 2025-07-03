import { useState, useCallback, useMemo } from "react";
import { productService } from "@/services/product-service";
import { Product } from "@/types/products";
import { CreateProductDto, UpdateProductDto } from "@/types/products.dto";
import { toast } from "sonner";

export function useProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.searchProducts(searchTerm);
      setProducts(result);
    } catch (err) {
      setError((err as Error).message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (dto: CreateProductDto) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.createProduct(dto);
      setProducts((current) => [newProduct, ...current]);
      toast.success(`Product "${newProduct.name}" has been created.`);
      return newProduct;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, dto: UpdateProductDto) => {
      setLoading(true);
      setError(null);
      console.log("dto from hooks", dto);
      try {
        const updated = await productService.updateProduct(id, dto);
        console.log("updated product response from hooks", updated);
        setProducts((current) =>
          current.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success(`Product "${updated.name}" has been updated.`);
        return updated;
      } catch (err) {
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
      toast.success(`Product deleted.`);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      products,
      loading,
      error,
      searchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      setProducts,
    }),
    [
      products,
      loading,
      error,
      searchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    ]
  );
}
// REFACTOR: All product list/search/CRUD business logic and state moved to hook for SRP, DRY, and testability.
