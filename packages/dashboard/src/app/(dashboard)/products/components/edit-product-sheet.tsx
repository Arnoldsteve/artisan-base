"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/products";
import {
  productFormSchema,
  ProductFormData,
} from "@/validation-schemas/products";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";

interface EditProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
  onSave: (product: ProductFormData) => void;
  isPending: boolean;
}

export function EditProductSheet({
  isOpen,
  onClose,
  product,
  onSave,
  isPending,
}: EditProductSheetProps) {
  const isNewProduct = !product?.id;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    // Initialize with empty defaults; the useEffect will populate it.
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      inventoryQuantity: 0,
      sku: "",
      isActive: true,
      isFeatured: false,
      description: "",
    },
  });

  // --- THIS IS THE FIX ---
  // This effect now correctly handles all cases and populates the form.
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // We are EDITING. The `product` prop is provided.
        form.reset({
          id: product.id,
          name: product.name || "",
          slug: product.slug || "",
          // Check if price is a Decimal object before calling .toNumber()
          price:
            product.price && typeof product.price.toNumber === "function"
              ? product.price.toNumber()
              : (product.price as unknown as number) || 0,
          inventoryQuantity: product.inventoryQuantity || 0,
          sku: product.sku || "",
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
          description: product.description || "",
        });
      } else {
        // We are CREATING. The `product` prop is null.
        // Reset to default empty values.
        form.reset({
          id: undefined,
          name: "",
          // slug: '',
          price: 0,
          inventoryQuantity: 0,
          sku: "",
          isActive: true,
          isFeatured: false,
          description: "",
        });
      }
    }
  }, [product, isOpen, form]);

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isNewProduct ? "Add New Product" : "Edit Product"}
          </SheetTitle>
          <SheetDescription>
            {isNewProduct
              ? "Fill in the details for the new product."
              : "Make changes to your product here. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inventoryQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Active</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Featured</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={10}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
