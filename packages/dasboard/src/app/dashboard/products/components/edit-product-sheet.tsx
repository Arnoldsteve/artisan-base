// packages/dasboard/src/components/products/edit-product-sheet.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@repo/ui';
import { Product } from '@/types/products';

interface EditProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  isPending: boolean;
}

export function EditProductSheet({ isOpen, onClose, product, onSave, isPending }: EditProductSheetProps) {
  // Internal state to manage form data
  const [formData, setFormData] = useState<Partial<Product>>({});

  // When a new product is passed in, update the form's state
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Handle number inputs correctly
      [id]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSaveClick = () => {
    // We assume all fields are present and cast to Product
    onSave(formData as Product);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>
            Make changes to your product here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input id="price" type="number" value={formData.price || 0} onChange={handleInputChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inventoryQuantity" className="text-right">Inventory</Label>
            <Input id="inventoryQuantity" type="number" value={formData.inventoryQuantity || 0} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </SheetClose>
          <Button onClick={handleSaveClick} disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}