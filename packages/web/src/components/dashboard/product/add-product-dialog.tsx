"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getUploadUrl, createProduct } from "@/lib/api"; // Assuming you are using the signed URL method
import { createProductSchema } from "@/lib/schemas";
import { Store } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface AddProductDialogProps {
  onProductAdded: () => void;
  store: Store;
}

const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
const SUPABASE_BUCKET_NAME = "product-images";

export function AddProductDialog({
  onProductAdded,
  store,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // <-- 1. Add our own loading state

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof createProductSchema>) {
    setIsLoading(true);
    setApiError(null);

    try {
      let imageUrl = "";
      const imageFile = values.image?.[0];

      if (imageFile) {
        // 1. Get the signed URL data from our backend
        const { path, token } = await getUploadUrl(
          imageFile.name,
          imageFile.type
        );

        // 2. Use the OFFICIAL Supabase helper to upload the file
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .uploadToSignedUrl(path, token, imageFile, {
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        // 3. Get the public URL for the file
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        imageUrl = data.publicUrl;
      }

      // 4. Call our backend to create the product record in the database
      await createProduct({
        name: values.name,
        price: values.price,
        description: values.description,
        imageUrl: imageUrl || undefined,
      });

      form.reset();
      setOpen(false);
      onProductAdded();
    } catch (error: any) {
      console.error("Failed to create product", error);
      setApiError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add a New Product</DialogTitle>
          <DialogDescription>
            Fill in the details for your new product. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* Name, Description, and Price FormFields are unchanged */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Handmade Leather Wallet" {...field} />
                  </FormControl>
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
                      placeholder="Describe your product..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="49.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- This is the new File Input Field --- */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(event) => onChange(event.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && <p className="text-sm text-red-500">{apiError}</p>}

            <DialogFooter>
              {/* <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Product"}
              </Button> */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
