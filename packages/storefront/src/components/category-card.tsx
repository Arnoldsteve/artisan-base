"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";
import { useTenantContext } from "@/contexts/tenant-context";
import { cn } from "@/lib/utils"; // Assuming you have a utility for tailwind classes

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "hero";
}

/**
 * SOLID Principle: Single Responsibility
 * A unified component for displaying category information across the marketplace.
 * Supports a 'hero' layout for category landing pages and 'default' for grids.
 */
export default function CategoryCard({ category, variant = "default" }: CategoryCardProps) {
  const { tenant } = useTenantContext();

  // 1. Enterprise Image Logic: High-quality placeholder for professional feel
  const imageUrl = `https://picsum.photos/seed/${category.id}/800/600`;

  // 2. Context-Aware Linking
  const categoryLink = tenant 
    ? `/shop/${tenant.subdomain}/categories/${category.slug}`
    : `/categories/${category.slug}`;

  if (variant === "hero") {
    return (
      <div className="relative w-full rounded-sm overflow-hidden border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch min-h-[300px]">
          {/* Hero Image */}
          <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Hero Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest">
                Collection
              </span>
              <div className="h-px w-8 bg-blue-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              {category.description || `Discover our unique selection of handcrafted ${category.name.toLowerCase()} items.`}
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm font-bold uppercase">
              <span className="text-foreground">
                {category._count?.products || 0} Products Found
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT CARD (for grids)
  return (
    <Link
      href={categoryLink}
      className="group flex flex-col bg-card border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Count Badge Overlay */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {category._count?.products || 0} Items
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-1">
          {category.description || `Explore our artisan ${category.name.toLowerCase()} items.`}
        </p>
      </div>
    </Link>
  );
}