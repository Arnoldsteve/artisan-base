'use client';

import { useCart } from '@/app/context/cart-context';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Button onClick={handleAddToCart} size="lg" className="w-full mt-6">
      Add to Cart
    </Button>
  );
}