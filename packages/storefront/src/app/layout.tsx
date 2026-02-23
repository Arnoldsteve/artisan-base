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
import { TenantProvider } from "@/contexts/tenant-context"; // 1. Import the Provider
import { cookies } from "next/headers";
import { parseConsent } from "@/lib/cookie";
import Analytics from "@/components/cookies/analytics";
import CookieConsentBanner from "@/components/cookies/cookie-consent-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artisan Base - Handcrafted Excellence",
  description: "Discover unique handcrafted products from talented artisans.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const raw = (await cookies()).get("cookie_consent")?.value ?? null;
  const initialConsent = raw ? parseConsent(raw) : null;
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics initialConsent={initialConsent} />
        
        <QueryProvider>
          {/* 
            TOP 1% ARCHITECTURE: 
            TenantProvider is placed inside QueryProvider (needs useQuery)
            and wraps Auth/Cart/Wishlist so they can all be tenant-aware.
          */}
          <TenantProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <Toaster position="bottom-right" richColors closeButton />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </TenantProvider>
        </QueryProvider>

        <CookieConsentBanner initialConsent={initialConsent} />
      </body>
    </html>
  );
}