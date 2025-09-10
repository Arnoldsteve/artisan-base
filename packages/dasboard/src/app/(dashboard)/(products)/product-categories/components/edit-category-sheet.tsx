"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Button } from "@repo/ui";
import { Category } from "@/types/category";

// Validation schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Name too long"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema> & { id?: string };

interface EditCategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (data: CategoryFormData) => void;
  isPending: boolean;
}

export function EditCategorySheet({
  isOpen,
  onClose,
  category,
  onSave,
  isPending,
}: EditCategorySheetProps) {
  const isEditing = !!category;
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when category changes or sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          name: category.name,
          description: category.description || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
        });
      }
    }
  }, [category, isOpen, form]);

  const handleSubmit = (data: CategoryFormData) => {
    const submitData = {
      ...data,
      ...(category && { id: category.id }),
    };
    onSave(submitData);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Make changes to the category details below."
              : "Create a new category for organizing your products."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Electronics, Clothing"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of the category as it will appear to customers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of what this category contains..."
                        className="min-h-[100px]"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description to help customers understand this category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Auto-generated slug preview */}
              {form.watch("name") && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <FormLabel className="text-xs text-gray-600">URL Slug Preview:</FormLabel>
                  <code className="text-xs text-gray-800 block mt-1">
                    /categories/{form.watch("name")
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w\-]+/g, "")
                      .replace(/\-\-+/g, "-")}
                  </code>
                </div>
              )}
            </div>

            <SheetFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Category" : "Create Category"}</>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}