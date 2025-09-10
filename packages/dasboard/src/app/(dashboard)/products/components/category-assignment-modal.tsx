// File: packages/dashboard/src/app/(dashboard)/products/components/category-assignment-modal.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import { Button } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import { Badge } from "@repo/ui";
import { toast } from "sonner";
import { apiClient } from "@/lib/client-api";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types/categories";

// interface Category {
//   id: string;
//   name: string;
//   slug: string;
// }

interface Product {
  id: string;
  name: string;
  categories?: Array<{ category: Category }>;
}

interface CategoryAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CategoryAssignmentModal({
  isOpen,
  onClose,
  product,
}: CategoryAssignmentModalProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // use hook (fetches paginated categories, defaults to first page)
  const { data, isLoading } = useCategories(1, 100); // limit high enough to fetch all
  const categories = data?.data || []; // PaginatedResponse<Category> → use data field

  // Preselect categories when modal opens
  useEffect(() => {
    if (isOpen && product) {
      const currentCategoryIds =
        product.categories?.map((pc) => pc.category.id) || [];
      setSelectedCategoryIds(currentCategoryIds);
    }
  }, [isOpen, product]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      await apiClient.patch(`/dashboard/products/${product.id}/categories`, {
        categoryIds: selectedCategoryIds,
      });

      toast.success("Product categories updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update categories");
    } finally {
      setIsSaving(false);
    }
  };

  const currentCategories = product?.categories?.map((pc) => pc.category) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Categories</DialogTitle>
          <DialogDescription>
            Select categories for "{product?.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Categories */}
          {currentCategories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {currentCategories.map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <h4 className="text-sm font-medium mb-3">Available Categories:</h4>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <label
                      htmlFor={category.id}
                      className="text-sm cursor-pointer capitalize"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
