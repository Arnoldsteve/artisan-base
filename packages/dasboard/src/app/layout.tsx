import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Your dashboard's global styles
import "@repo/ui/styles.css"; // <-- ADD THIS LINEimport { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artisan-Base Dashboard",
  description: "Manage your store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
