"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@repo/ui";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = () => {
    // In a real app, this would add the product to a cart state/context
    toast.success(`${product.name} has been added to your cart.`);
  };

  return (
    <div className="group relative bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex items-center space-x-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
