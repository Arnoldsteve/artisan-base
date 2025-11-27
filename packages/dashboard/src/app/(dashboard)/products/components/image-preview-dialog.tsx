"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Product } from "@/types/products";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ImagePreviewDialog({
  isOpen,
  onClose,
  product,
}: ImagePreviewDialogProps) {
  const images = product?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[90vw] max-w-[800px] 
          h-[80vh] max-h-[600px] 
          flex flex-col justify-between
        "
      >
        <DialogHeader>
          <DialogTitle className="truncate">
            {product.name} - Images
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center">
          {images.length > 0 ? (
            <div className="relative flex-1 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center bg-black/5 rounded-lg">
                <Image
                  src={images[currentIndex].url}
                  alt={`${product.name} image`}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No images available
            </p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
