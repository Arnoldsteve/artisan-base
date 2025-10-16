import CategoryListPage from "@/components/category/categories-list-page";
import { createMetadata } from "@/lib/metadata";
import React from "react";

export const metadata = createMetadata({
  title: "Shop by Category | Handcrafted Artisan Products - Artisan Base",
  description: "Explore our curated categories of handcrafted artisan products. From home decor and lighting to kitchen essentials and wellness products - find the perfect handmade item.",
  
  openGraph: {
    title: "Browse Artisan Product Categories",
    description: "Discover handcrafted treasures organized by category. Home decor, lighting, kitchen tools, wellness products and more from talented artisans.",
    url: "https://artisan-base-storefront.vercel.app/categories",
    images: [
      { 
        url: "/categories-og-image.png", 
        width: 1200, 
        height: 630, 
        alt: "Artisan product categories" 
      },
    ],
  },
  
  twitter: {
    title: "Browse Artisan Product Categories",
    description: "Discover handcrafted treasures organized by category. Support independent artisans.",
    images: ["/categories-og-image.png"],
  },
});

export default function page() {
  return <CategoryListPage />;
}