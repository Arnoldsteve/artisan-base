"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "sonner";
import { CartItem, Product } from "@/types";

// Mock cart data - in a real app this would come from a cart context/state
const mockCartItems: CartItem[] = [
  {
    id: "1",
    productId: "1",
    quantity: 2,
    product: {
      id: "1",
      name: "Handcrafted Ceramic Mug",
      description: "Beautiful handcrafted ceramic mug with unique glaze",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      category: "Kitchenware",
      categoryId: "kitchen",
      rating: 4.8,
      reviewCount: 127,
      inventoryQuantity: 15,
      sku: "CER-MUG-001",
      tags: ["ceramic", "mug", "handcrafted"],
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
  },
  {
    id: "2",
    productId: "2",
    quantity: 1,
    product: {
      id: "2",
      name: "Wooden Cutting Board",
      description: "Premium hardwood cutting board with natural finish",
      price: 89.99,
      originalPrice: 119.99,
      image:
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop",
      category: "Kitchenware",
      categoryId: "kitchen",
      rating: 4.9,
      reviewCount: 89,
      inventoryQuantity: 8,
      sku: "WOOD-CB-002",
      tags: ["wooden", "cutting board", "kitchen"],
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.originalPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 9.99; // Free shipping over $100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    // Navigate to checkout page
    window.location.href = "/checkout";
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
          cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-6 border-b last:border-b-0"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.product.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-lg font-semibold text-foreground">
                      $
                      {(
                        item.product.originalPrice || item.product.price
                      ).toFixed(2)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 mr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.inventoryQuantity}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Item Total */}
                <div className="text-right mr-4">
                  <div className="font-semibold text-foreground">
                    $
                    {(
                      (item.product.originalPrice || item.product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">
                  ${calculateTax().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {calculateShipping() === 0
                    ? "Free"
                    : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-foreground">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full mb-4" size="lg">
              Proceed to Checkout
            </Button>

            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>

            {calculateSubtotal() < 100 && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary">
                  Add ${(100 - calculateSubtotal()).toFixed(2)} more for free
                  shipping!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
