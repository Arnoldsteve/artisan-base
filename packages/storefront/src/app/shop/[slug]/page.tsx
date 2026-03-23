"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  ShopHero,
  ShopHeader,
  ShopSidebar,
  ShopContent,
} from "@/components/shop";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/product";
import { ShopFilterState } from "@/types/shop-filters";
import { useShopProducts } from "@/hooks/use-products";
import { useTenantContext } from "@/contexts/tenant-context";
import { ProductsLoading } from "@/components/skeletons/product-card-skeleton";
import { InfiniteLoader } from "@/components/shared/infinite-loader";

export default function ShopProfilePage() {
  const {
    tenant: shop,
    isLoading: isContextLoading,
    isError,
  } = useTenantContext();

  // 2. Local Discovery State
  const [activeFilters, setActiveFilters] = useState<ShopFilterState>({
    categories: [],
    priceRange: [0, 1000000],
    minRating: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // 3. 🚀 THE REAL ENGINE: Fetch products
  // Note: We don't pass shop.id here because the apiClient already has it in the headers!
  const {
    data: infiniteData,
    isLoading: isProductsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useShopProducts(
    {
      search: searchTerm,
      category: activeFilters.categories[0],
      minPrice: activeFilters.priceRange[0],
      maxPrice: activeFilters.priceRange[1],
      rating: activeFilters.minRating ?? undefined,
    },
    20,
  );

  const allProducts = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.data) ?? [],
    [infiniteData],
  );


  // 5. Sidebar Stats Transformation (Using real data from shop context)
  const shopStats = useMemo(
    () => [
      { label: "Products", value: shop?._count?.products || 0 },
      { label: "Location", value: shop?.city || "Nairobi" },
      {
        label: "Member Since",
        value: shop?.createdAt
          ? new Date(shop.createdAt).getFullYear()
          : "2024",
      },
    ],
    [shop],
  );

  // 🛡️ The TenantProvider handles the "Entering Store..." full-page loader,
  // so we only handle the error or empty state here.
  if (isError || !shop)
    return (
      <div className="p-20 text-center text-rose-500 font-bold uppercase tracking-widest">
        Shop Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <ShopHero bannerImage={shop.bannerUrl ?? undefined} />

      <div className="container mx-auto px-4">
        <ShopHeader
          name={shop.name}
          logo={shop.logoUrl ?? undefined}
          location={shop.city || "Nairobi, Kenya"}
          rating={Number(shop.averageRating) || 0}
          reviewCount={shop._count?.reviews || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-10">
          <aside className="lg:col-span-1">
            <ShopSidebar
              description={shop.description || "Craftsmanship redefined."}
              stats={shopStats}
            />
          </aside>

          <main className="lg:col-span-3">
            <ShopContent
              onSearch={setSearchTerm}
              onApplyFilters={setActiveFilters}
            >
              {isProductsLoading && allProducts.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <ProductsLoading />
                </div>
              ) : allProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {allProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product as Product}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    No products found
                  </p>
                </div>
              )}

              <InfiniteLoader
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
              />
            </ShopContent>
          </main>
        </div>
      </div>
    </div>
  );
}
