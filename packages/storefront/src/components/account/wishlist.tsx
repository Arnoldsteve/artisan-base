"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useWishlistContext } from "@/contexts/wishlist-context";
import { useCartContext } from "@/contexts/cart-context";

export const Wishlist: React.FC = () => {
  const { items: wishlistItems, removeFromWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
        <CardDescription>Save items you love for later</CardDescription>
      </CardHeader>
      <CardContent>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground mb-4">
              Start adding items you love to your wishlist
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col group border border-gray-100 hover:border-primary transition"
              >
                <Link href={`/products/${item.id}`} className="block mb-3">
                  <img
                    src={
                      item.image ||
                      `https://picsum.photos/200/200?random=${item.id}`
                    }
                    alt={item.name}
                    className="w-full h-40 object-cover rounded group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <span className="text-primary font-bold mb-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.price)}
                  </span>
                  <span className="inline-block bg-accent text-xs px-2 py-1 rounded mb-2">
                    {item.category}
                  </span>
                  <div className="flex space-x-2 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          slug: item.slug || item.id,
                          description: item.description || "",
                          image: item.image,
                          quantity: 1,
                          inventoryQuantity: item.inventoryQuantity,
                        })
                      }
                      disabled={item.inventoryQuantity === 0}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {item.inventoryQuantity > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
