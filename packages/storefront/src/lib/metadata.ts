// src/lib/metadata.ts
import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://artisan-base-storefront.vercel.app"),
  title: "Artisan Base - Handcrafted Excellence",
  description:
    "Discover unique handcrafted products from talented artisans around the world.",
  openGraph: {
    title: "Artisan Base - Handcrafted Excellence",
    description:
      "Discover unique handcrafted products from talented artisans around the world.",
    url: "https://artisan-base-storefront.vercel.app",
    siteName: "Artisan Base",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Artisan Base Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisan Base - Handcrafted Excellence",
    description:
      "Discover unique handcrafted products from talented artisans around the world.",
    images: ["/og-image.png"],
  },
};

// src/lib/metadata.ts
export function createMetadata(overrides: Partial<Metadata> | ((data: any) => Partial<Metadata>), data?: any): Metadata {
  const finalOverrides = typeof overrides === "function" ? overrides(data) : overrides;
  return {
    ...defaultMetadata,
    ...finalOverrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...finalOverrides.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...finalOverrides.twitter,
    },
  };
}
