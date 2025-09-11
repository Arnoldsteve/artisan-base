import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AuthProvider } from "@/contexts/auth-context";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <CartProvider>
            <WishlistProvider>
              <AuthProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  {/* <ChatWidget /> */}
                  <Footer />
                </div>
                <Toaster position="bottom-right" richColors closeButton />
              </AuthProvider>
            </WishlistProvider>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
