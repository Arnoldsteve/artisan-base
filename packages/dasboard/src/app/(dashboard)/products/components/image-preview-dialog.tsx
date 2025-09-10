"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@repo/ui";
import { Button } from "@repo/ui";
import { Product } from "@/types/products";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ImagePreviewDialog({ isOpen, onClose, product }: ImagePreviewDialogProps) {
  const images = product?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name} - Images</DialogTitle>
        </DialogHeader>

        {images.length > 0 ? (
          <div className="relative flex items-center justify-center">
            <Image
              src={images[currentIndex].url}
              alt={`${product.name} image`}
              width={500}
              height={500}
              className="rounded-lg object-contain max-h-[70vh]"
            />

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
          <p className="text-muted-foreground text-center py-10">No images available</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
