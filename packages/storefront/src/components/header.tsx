"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@repo/ui";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Artisan Base</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium hover:text-primary"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        {/* Search and Cart */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-4">
            <Link
              href="/products"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
