import { ProductsContent } from '@/components/products/product-list-page'
import React from 'react'
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Handcrafted Artisan Products | Home Decor | Electronics, Gifts & More - Artisan Base",
  description: "Discover unique handcrafted products from talented artisans. Shop home decor, lamps, cutting boards, candles, and more. Each piece tells a story of craftsmanship and quality.",
  
  openGraph: {
    title: "Shop Unique Handcrafted Artisan Products",
    description: "Explore our curated collection of handmade treasures. From Himalayan salt lamps to bamboo cutting boards - support independent artisans.",
    url: "https://artisan-base-storefront.vercel.app/products",
    images: [
      { 
        url: "/products-og-image.png", 
        width: 1200, 
        height: 630, 
        alt: "Curated collection of handcrafted artisan products" 
      },
    ],
  },
  
  twitter: {
    title: "Shop Unique Handcrafted Artisan Products",
    description: "Discover handmade treasures from talented artisans. Every purchase supports independent creators.",
    images: ["/products-og-image.png"],
  },
});

export default function page() {
  return (
    <div>
      <ProductsContent />
    </div>
  )
}