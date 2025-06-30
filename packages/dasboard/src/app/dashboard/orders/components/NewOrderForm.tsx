'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/api';
import { Product } from '@/types/products';
import { CreateOrderDto } from '@/types/orders';
import { useDebounce } from '@/hooks/use-debounce'; // Assuming you have a debounce hook

import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { toast } from 'sonner';
import { Loader2, X, PlusCircle, MinusCircle } from 'lucide-react';

// A type for the items in our local state, combining Product info with quantity
type OrderItemState = Product & { quantity: number };

export function NewOrderForm() {
  const router = useRouter();
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState<OrderItemState[]>([]);
  
  // Product Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Effect for handling debounced product search
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResults([]);
      return;
    }

    const searchProducts = async () => {
      setIsSearching(true);
      try {
        // We'll need a way to search products. Let's assume getProducts can handle a search query
        const response = await api.products.getProducts(1, 5, debouncedSearchTerm);
        console.log('Search results:', response.data);
        setSearchResults(response.data);
      } catch (error) {
        toast.error("Failed to search for products.");
      } finally {
        setIsSearching(false);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);

  // Action handlers
  const handleAddItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, just increase quantity
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Otherwise, add new item with quantity 1
      return [...currentItems, { ...product, quantity: 1 }];
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
    );
  };

  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (items.length === 0) {
      setFormError("Please add at least one product to the order.");
      return;
    }
    setIsSubmitting(true);

    const orderData: CreateOrderDto = {
      customerName,
      customerEmail,
      shippingAddress,
      items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
    };

    try {
      const newOrder = await api.orders.createOrder(orderData);
      toast.success(`Order #${newOrder.orderNumber} created successfully!`);
      // Redirect to the newly created order's detail page
      router.push(`/dashboard/orders/${newOrder.id}`);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
          <CardContent>
            {/* Product Search */}
            <div className="relative space-y-2">
              <Label htmlFor="product-search">Add Product</Label>
              <Input
                id="product-search"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin text-muted-foreground" />}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                  <ul>
                    {searchResults.map(product => (
                      <li key={product.id}>
                        <button type="button" onClick={() => handleAddItem(product)} className="w-full text-left px-4 py-2 hover:bg-muted">
                          {product.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Added Items Table */}
            <div className="mt-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No items added to the order.</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-1 font-medium">{item.name}</div>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)} className="w-16 h-8 text-center" />
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-24 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Full Name</Label>
              <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Email Address</Label>
              <Input id="customer-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Input id="shipping-address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            {formError && <p className="text-sm text-destructive mt-4">{formError}</p>}
            <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}