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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artisan Base - Handcrafted Excellence",
  description:
    "Discover unique handcrafted products from talented artisans around the world.",
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
