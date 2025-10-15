import { ProductsContent } from '@/components/products/product-list-page'
import React from 'react'

// src/app/products/page.tsx
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Products - Artisan Base",
  description: "Browse all handcrafted products from talented artisans.",
  openGraph: {
    title: "Products - Artisan Base",
    description: "Browse all handcrafted products from talented artisans.",
    images: [
      { url: "/products-og-image.png", width: 1200, height: 630, alt: "Products" },
    ],
  },
});


export default function page() {
  return (
    <div>
      <ProductsContent/>
    </div>
  )
}
