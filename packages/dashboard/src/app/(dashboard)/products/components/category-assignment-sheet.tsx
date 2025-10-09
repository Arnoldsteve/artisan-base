"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Button,
  Checkbox,
  Badge,
  Input
} from "@repo/ui";
import { toast } from "sonner";
import { Category } from "@/types/categories";
import { Product } from "@/types/products";
import { useAssignCategories } from "@/hooks/use-products";

interface CategoryAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CategoryAssignmentSheet({ isOpen, onClose, product }: CategoryAssignmentModalProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mutation = useAssignCategories();
  const isLoading = mutation.status === "pending";

  // Preselect current categories
  useEffect(() => {
    if (isOpen && product) {
      const currentCategoryIds = product.categories?.map((c) => c.id) || [];


      setSelectedCategoryIds(currentCategoryIds);
    }
  }, [isOpen, product]);

  // Live search categories
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    let active = true;
    setIsSearching(true);

    import("@/services/category-service").then(({ categoryService }) => {
      categoryService.searchCategories(searchTerm)
        .then((results) => {
          if (active) setSearchResults(results);
        })
        .catch(() => setSearchResults([]))
        .finally(() => { if (active) setIsSearching(false); });
    });

    return () => { active = false; };
  }, [searchTerm]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleRemoveSelected = (categoryId: string) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  };

  const handleSave = () => {
    if (!product) return;

    mutation.mutate(
      { productId: product.id, categoryIds: selectedCategoryIds },
      {
        onSuccess: () => {
          toast.success("Product categories updated successfully");
          onClose();
        },
        onError: () => toast.error("Failed to update categories"),
      }
    );
  };

  // Merge search results + current product categories for badge display
  const allCategoriesMap: Record<string, Category> = {};
  // product?.categories?.forEach((c) => { allCategoriesMap[c.id] = c; });
  product?.categories?.forEach((c) => { allCategoriesMap[c.id] = c; });

  searchResults.forEach((c) => { allCategoriesMap[c.id] = c; });
  const selectedCategories = selectedCategoryIds.map((id) => allCategoriesMap[id]).filter(Boolean);

  // console.log("selected category",selectedCategories )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign Categories</SheetTitle>
          <SheetDescription>Assign categories to "{product?.name}"</SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {selectedCategories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium my-3">Selected Categories:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleRemoveSelected(cat.id)}
                  >
                    {cat.name} ✕
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <div className="space-y-2 max-h-48 overflow-y-auto mt-2">
              {isSearching && <div className="text-sm text-gray-500">Searching...</div>}
              {!isSearching && searchResults.length === 0 && (
                <div className="text-sm text-gray-500">No categories found</div>
              )}
              {!isSearching &&
                searchResults.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <label htmlFor={category.id} className="text-sm cursor-pointer capitalize">
                      {category.name}
                    </label>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <SheetFooter className="pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
