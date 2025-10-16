import CategoryDetailsPage from "@/components/category/category-description-page";
import { createMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category-service";
import React from "react";

async function fetchCategory(identifier: string) {
  try {
    const category = await categoryService.getCategoryById(identifier);
    return category;
  } catch (e) {
    console.error("error fetching categories", e);
    return null;
  }
}

interface PageParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) {
    return createMetadata({
      title: "Category Not Found - Artisan Base",
      description: "This category does not exist or has been removed.",
      robots: {
        index: false,
        follow: true,
      },
    });
  }

  // Create rich description
  const description = category.description
    ? `${category.description.slice(0, 150)}... Browse our collection of handcrafted ${category.name.toLowerCase()} from talented artisans.`
    : `Discover unique handcrafted ${category.name.toLowerCase()} from talented artisans. Quality products made with care and craftsmanship.`;

  const categoryImage = typeof category.image === "string"
    ? category.image
    : ((category.image as unknown as { url?: string })?.url || "/default-category.jpg");

  return createMetadata({
    title: `${category.name} | Handcrafted Artisan Products - Artisan Base`,
    description,

    openGraph: {
      title: `Shop Handcrafted ${category.name}`,
      description: category.description || `Browse our curated collection of handmade ${category.name.toLowerCase()}.`,
      url: `https://artisan-base-storefront.vercel.app/categories/${slug}`,
      images: [
        {
          url: categoryImage,
          width: 1200,
          height: 630,
          alt: `${category.name} category`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Shop Handcrafted ${category.name}`,
      description: category.description?.slice(0, 160) || `Handcrafted ${category.name.toLowerCase()} from talented artisans`,
      images: [categoryImage],
    },
  });
}

export default async function page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  console.log("slug", slug);
  
  const category = await fetchCategory(slug);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground">
          This category does not exist or has been removed.
        </p>
      </div>
    );
  }

  // Generate Category JSON-LD structured data
  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description || `Handcrafted ${category.name}`,
    "url": `https://artisan-base-storefront.vercel.app/categories/${slug}`,
    ...(category.image && {
      "image": typeof category.image === "string"
        ? category.image
        : (category.image as { url?: string })?.url,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <CategoryDetailsPage initialCategory={category} />
    </>
  );
}