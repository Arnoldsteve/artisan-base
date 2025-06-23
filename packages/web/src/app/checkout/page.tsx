// In packages/web/src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
// import { useCart } from '@/context/cart-context';
import { createOrder } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- Import useSearchParams
import { toast } from 'sonner';
import { useCart } from '../context/cart-context';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // We need to know which store this order is for.
  // A real app might get this from the URL or cart state.
  // For now, let's assume it's passed as a query parameter.
  // A better way would be to store storeId in the cart context.
  const storeId = "malaikabeads"; // We'll fix this later to be dynamic

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const orderData = {
      customerEmail: email,
      items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
    };

    try {
      await createOrder(storeId, orderData);
      toast.success('Order placed successfully!');
      // Here you would clear the cart and redirect to a thank you page
      // clearCart();
      router.push(`/`);
    } catch (error) {
      toast.error('Failed to place order.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4 mb-8">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg border-t pt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handlePlaceOrder}>
        <div className="grid gap-2 mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || cartItems.length === 0}>
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </div>
  );
}