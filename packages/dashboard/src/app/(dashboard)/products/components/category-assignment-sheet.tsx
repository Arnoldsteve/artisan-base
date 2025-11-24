"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@repo/ui/components/ui/sheet";
import { Badge } from "@repo/ui/components/ui/badge";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { Category } from "@/types/categories";
import { Product } from "@/types/products";
import { useAssignCategories } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import { categoryService } from "@/services/category-service";
import { Label } from "@repo/ui/components/ui/label";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@repo/ui/components/ui/command";

interface CategoryAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CategoryAssignmentSheet({
  isOpen,
  onClose,
  product,
}: CategoryAssignmentModalProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mutation = useAssignCategories();
  const isLoading = mutation.status === "pending";
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Preselect current categories safely
  useEffect(() => {
    if (isOpen && product) {
      const currentCategoryIds =
        product.categories?.map((c) => c.category?.id) ?? [];
      setSelectedCategoryIds(currentCategoryIds);
    }
  }, [isOpen, product]);

  // Debounced live search
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }

    let active = true;
    setIsSearching(true);

    categoryService
      .searchCategories(debouncedSearch)
      .then((results) => {
        console.log("Results received:", results);
        if (active) {
          setSearchResults(results || []);
        }
      })
      .catch((error) => {
        console.error("Search error:", error);
        if (active) setSearchResults([]);
      })
      .finally(() => {
        if (active) setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
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

  // Merge current product categories + search results
  const allCategoriesMap: Record<string, Category> = {};
  (product?.categories ?? []).forEach((c) => {
    if (c.category) {
      allCategoriesMap[c.category.id] = c.category;
    }
  });

  const selectedCategories = selectedCategoryIds
    .map((id) => allCategoriesMap[id])
    .filter(Boolean);

  // console.log("product.categories", product?.categories);
  // console.log("selectedCategoryIds", selectedCategoryIds);
  // console.log("selectedCategories", selectedCategories);

  // console.log("allCategoriesMap",allCategoriesMap)
  // console.log("selectedCategories",selectedCategories)
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign Categories</SheetTitle>
          <SheetDescription>
            Assign categories to{" "}
            <span className="font-semibold">{product?.name}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {selectedCategories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium my-2">Selected Categories:</h4>
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

          {/* Command search */}
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search categories..."
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)}
            />
            <CommandList className="max-h-48 overflow-y-auto">
              {isSearching && (
                <div className="text-sm text-gray-500 px-2 py-1">
                  Searching...
                </div>
              )}
              {!isSearching && searchResults.length === 0 && searchTerm && (
                <CommandEmpty>No categories found</CommandEmpty>
              )}

              <CommandGroup>
                {searchResults.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={() => handleCategoryToggle(category.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Label className="text-sm capitalize">
                        {category.name}
                      </Label>
                      <Checkbox
                        checked={selectedCategoryIds.includes(category.id)}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <SheetFooter className="pt-4 flex justify-end gap-2">
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
