"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { 
  ShopHero, 
  ShopHeader, 
  ShopSidebar, 
  ShopContent 
} from "@/components/shop";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/product";
import { ShopFilterState } from "@/types/shop-filters";

export default function ShopProfilePage() {
  const { slug } = useParams<{ slug: string }>();

  // 1. Filter Logic State (Enterprise Pattern: Controlled by Page Container)
  const [activeFilters, setActiveFilters] = useState<ShopFilterState>({
    categories: [],
    priceRange: [0, 100000],
    minRating: null
  });
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Static Mock Data (Institutional Identity)
  const mockShop = {
    id: "static-id",
    name: "Artisan Furniture",
    slug: slug || "artisan-furniture",
    description: "Handcrafted sustainable wood furniture designed for modern living. Every piece tells a story of heritage and craftsmanship from the heart of Nairobi.",
    city: "Nairobi, Kenya",
    averageRating: 4.9,
    bannerUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1600&q=80",
    logoUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    _count: { products: 6, reviews: 128 }
  };

  // 3. Simulated Discovery Logic (Filter Implementation)
  const filteredProducts = useMemo(() => {
    const products: Partial<Product>[] = [1, 2, 3, 4, 5, 6].map((i) => ({
      id: `prod-${i}`,
      name: `${i === 1 ? 'Vintage' : 'Premium'} Handcrafted Item ${i}`,
      price: 1500 * i,
      currency: "KES",
      images: [{ url: `https://picsum.photos/seed/artisan-${i}/400/500`, id: `${i}`, path: "" }],
      averageRating: 4.0 + (i * 0.1),
      reviewCount: 12,
      tenantId: "static-id"
    }));

    return products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (p.price || 0) >= activeFilters.priceRange[0] && (p.price || 0) <= activeFilters.priceRange[1];
      const matchesRating = !activeFilters.minRating || (p.averageRating || 0) >= activeFilters.minRating;
      
      return matchesSearch && matchesPrice && matchesRating;
    });
  }, [searchTerm, activeFilters]);

  // 4. Sidebar Stats Metadata
  const shopStats = useMemo(() => [
    { label: "Products", value: mockShop._count.products },
    { label: "Response Time", value: "~2 hours" },
    { label: "Joined", value: new Date(mockShop.createdAt).getFullYear() }
  ], [mockShop._count.products, mockShop.createdAt]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <ShopHero bannerImage={mockShop.bannerUrl} />

      <div className="container mx-auto px-4">
        <ShopHeader 
          name={mockShop.name} 
          logo={mockShop.logoUrl} 
          location={mockShop.city} 
          rating={mockShop.averageRating} 
          reviewCount={mockShop._count.reviews}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-10">
          <aside className="lg:col-span-1">
            <ShopSidebar 
              description={mockShop.description} 
              stats={shopStats} 
            />
          </aside>

          <main className="lg:col-span-3">
            {/* 🚀 THE ORCHESTRATION: Connecting Search & Filter State */}
            <ShopContent 
                onSearch={setSearchTerm} 
                onApplyFilters={setActiveFilters}
            >
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product as Product} />
                    ))
                 ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No products match your criteria</p>
                    </div>
                 )}
               </div>
            </ShopContent>
          </main>
        </div>
      </div>
    </div>
  );
}