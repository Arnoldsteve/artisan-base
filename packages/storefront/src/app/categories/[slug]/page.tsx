import { createMetadata } from "@/lib/metadata";
import CategoryDetailsPage from "@/components/category/category-description-page";
import { categoryService } from "@/services/category-service";
import { notFound } from "next/navigation";
import React from "react";

/**
 * TOP 1% ARCHITECTURE: SEO & Identity Handshake
 * We fetch the category on the server to ensure Google/Social Media 
 * can see the metadata instantly.
 */
async function fetchCategory(slug: string) {
  try {
    // millions of users: Using slug for SEO instead of internal IDs
    // Note: Ensure your backend CategoryController has a /slug/:slug endpoint
    const category = await categoryService.getCategoryBySlug(slug);
    return category;
  } catch (e) {
    console.error(`[Server] Error fetching category: ${slug}`, e);
    return null;
  }
}

interface PageParams {
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) {
    return createMetadata({
      title: "Category Not Found | Artisan Base",
      description: "This artisan collection is no longer available.",
    });
  }

  return createMetadata({
    title: `${category.name} | Handcrafted Artisan Products - Artisan Base`,
    description: category.description?.slice(0, 160) || `Browse our unique ${category.name} collection.`,
    openGraph: {
      title: `Shop Handcrafted ${category.name}`,
      url: `https://artisan-base.com/categories/${slug}`,
      images: [{ url: "/default-category-og.png" }], // Scale tip: Use category.image if available
    },
  });
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) {
    notFound();
  }

  // Generate Category JSON-LD (Search Engine Optimization)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "url": `https://artisan-base.com/categories/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryDetailsPage initialCategory={category} />
    </>
  );
}