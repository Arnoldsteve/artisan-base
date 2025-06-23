'use client';

import { useCart } from '@/app/context/cart-context';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartIcon() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/checkout" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Link>
  );
}