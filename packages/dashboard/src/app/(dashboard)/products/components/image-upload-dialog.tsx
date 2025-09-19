"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@repo/ui";
import { Button } from "@repo/ui";
import {
  useUploadProductImages,
  useDeleteProductImage,
} from "@/hooks/use-image-uploads";
import { Product } from "@/types/products";
import { toast } from "sonner";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

// Helper type for combined image data (existing or new)
type ImagePreview = {
  id: string; // For existing images, this is the DB ID. For new, a temp ID.
  url: string; // For existing, this is the public URL. For new, a blob URL.
  file?: File; // Only new images have a File object
};

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ImageUploadDialog({ isOpen, onClose,  product }: ImageUploadDialogProps) {
  // State for new files to be uploaded
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // State for previewing all images (existing + new)
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  // Mutations for uploading and deleting images
  const { mutate: uploadImages, isPending: isUploading } =
    useUploadProductImages();
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteProductImage();

  // Effect to populate previews when the dialog opens or product data changes
  useEffect(() => {
    if (product?.images) {
      const existing = product.images.map((img) => ({
        id: img.id,
        url: img.url,
      }));
      const fresh = newFiles.map((file) => ({
        id: file.name, // Use name as temporary ID
        url: URL.createObjectURL(file),
        file,
      }));
      setImagePreviews([...existing, ...fresh]);
    }

    // Cleanup blob URLs to prevent memory leaks
    return () => {
      imagePreviews.forEach((p) => {
        if (p.file) URL.revokeObjectURL(p.url);
      });
    };
  }, [product, newFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files!)]);
    }
    // Clear the input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleRemovePreview = (idToRemove: string) => {
    setNewFiles(newFiles.filter((file) => file.name !== idToRemove));
  };

  const handleDeleteExistingImage = (imageId: string) => {
    if (!product) return;
    deleteImage({ productId: product.id, imageId });
  };

  const handleUploadNewImages = () => {
    if (!product) {
      toast.error("No product selected.");
      return;
    }
    if (newFiles.length === 0) {
      toast.error("No new images to upload.");
      return;
    }

    uploadImages(
      { productId: product.id, images: newFiles },
      {
        onSuccess: () => {
          setNewFiles([]); // Clear the new files on success
          onClose(); // Close the dialog on success
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Images for {product?.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-4 max-h-96 overflow-y-auto">
          {imagePreviews.map((preview) => (
            <div key={preview.id} className="relative group">
              <Image
                src={preview.url}
                alt="Product image preview"
                width={150}
                height={150}
                className="rounded-md object-cover w-full aspect-square"
              />
              <div className="absolute top-1 right-1">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    preview.file
                      ? handleRemovePreview(preview.id)
                      : handleDeleteExistingImage(preview.id)
                  }
                  disabled={isDeleting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Uploader Input */}
          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="mb-1 text-sm text-center text-muted-foreground">
                <span className="font-semibold">Click to upload</span>
              </p>
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
            />
          </label>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Done</Button>
          </DialogClose>
          <Button
            onClick={handleUploadNewImages}
            disabled={isUploading || newFiles.length === 0}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload {newFiles.length > 0 ? `${newFiles.length} New` : ""} Image(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}