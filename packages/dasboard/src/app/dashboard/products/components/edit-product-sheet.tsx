// packages/dasboard/src/components/products/edit-product-sheet.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button, Textarea, Input, Label, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@repo/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import { Product } from '@/types/products';

interface EditProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => void;
  isPending: boolean;
}

export function EditProductSheet({ isOpen, onClose, product, onSave, isPending }: EditProductSheetProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isNumberInput = e.target instanceof HTMLInputElement && type === 'number';
    
    setFormData((prev) => ({
      ...prev,
      [id]: isNumberInput ? parseFloat(value) : value, // Keep it simple here
    }));
  };

  const handleSelectChange = (field: 'isActive' | 'isFeatured', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === 'true',
    }));
  };
  
  // *** THE FIX IS HERE ***
  const handleSaveClick = () => {
    // Create a new payload to ensure data types are correct before saving
    const payloadToSave = {
      ...formData,
      // Explicitly parse the price and inventory fields to numbers.
      // Use String() to prevent errors if the value is already a number.
      // Default to 0 if parsing fails.
      price: parseFloat(String(formData.price)) || 0,
      inventoryQuantity: parseInt(String(formData.inventoryQuantity)) || 0,
    };
    console.log("Saving product with payload:", payloadToSave);

    // Send the clean, type-safe payload
    onSave(payloadToSave as Product);
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
        {/* --- FORM JSX REMAINS THE SAME --- */}
        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          {/* Slug */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">Slug</Label>
            <Input id="slug" value={formData.slug || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          {/* Price */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input id="price" type="number" value={formData.price || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          {/* Inventory */}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inventoryQuantity" className="text-right">Inventory</Label>
            <Input id="inventoryQuantity" type="number" value={formData.inventoryQuantity || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          {/* SKU */}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">SKU</Label>
            <Input id="sku" value={formData.sku || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          {/* Is Active */}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">Is Active</Label>
            <Select
              value={String(formData.isActive ?? false)}
              onValueChange={(value) => handleSelectChange('isActive', value)}
            >
              <SelectTrigger id="isActive" className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Is Featured */}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isFeatured" className="text-right">Is Featured</Label>
            <Select
              value={String(formData.isFeatured ?? false)}
              onValueChange={(value) => handleSelectChange('isFeatured', value)}
            >
              <SelectTrigger id="isFeatured" className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Description */}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={formData.description || ''} onChange={handleInputChange}   rows={15} className="col-span-3" />
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