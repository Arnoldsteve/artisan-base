import React, { useState, useEffect } from "react";
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all categories when modal opens
  useEffect(() => {
    if (isOpen && product) {
      fetchCategories();
      // Set currently assigned categories
      const currentCategoryIds = product.categories?.map(pc => pc.category.id) || [];
      setSelectedCategoryIds(currentCategoryIds);
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (!product) return;

    setIsSaving(true);
    // try {
    //   const response = await fetch(`/api/products/${product.id}/categories`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ categoryIds: selectedCategoryIds }),
    //   });

    //   if (!response.ok) throw new Error('Failed to update categories');

    //   toast.success('Product categories updated successfully');
    //   onClose();
      
    //   // You might want to refetch the products data here
    //   // or use a mutation that invalidates the query
    // } catch (error) {
    //   toast.error('Failed to update categories');
    // } finally {
    //   setIsSaving(false);
    // }

    console.log('Selected Category IDs:', selectedCategoryIds);
  };

  const currentCategories = product?.categories?.map(pc => pc.category) || [];

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
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
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