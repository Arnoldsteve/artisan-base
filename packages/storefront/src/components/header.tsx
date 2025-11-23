"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  Grid3X3,
  Info,
  Phone,
  Truck,
  UserX,
  Settings,
  Heart,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { CartButton } from "@/components/cart/cart-button";
import { UserAccountDropdown } from "./UserAccountDropdown";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/components/ui/input";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="Home"
          >
            <span className="text-xl font-bold text-blue-500">
              Artisan Base
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className={`text-foreground hover:text-primary transition-colors ${
                pathname === "/products" ? "text-primary" : ""
              }`}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className={`text-foreground hover:text-primary transition-colors ${
                pathname === "/categories" ? "text-primary" : ""
              }`}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={`text-foreground hover:text-primary transition-colors ${
                pathname === "/about" ? "text-primary" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-foreground hover:text-primary transition-colors ${
                pathname === "/contact" ? "text-primary" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md"
          >
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className=""
            />

            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <CartButton onClick={() => router.push("/cart")} />
            <div className="relative" ref={userDropdownRef}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                onClick={() => setIsUserDropdownOpen((open) => !open)}
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="menu"
              >
                <User className="h-5 w-5" />
              </Button>
              <UserAccountDropdown
                open={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-4 border-t">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Button
              type="submit"
              variant={"default"}
              size={"sm"}
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Grid3X3 className="h-5 w-5" />
                <span>Categories</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                <span>About</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Contact</span>
              </Link>

              {/* ADD CART BUTTON HERE */}
              <div className="border-t pt-4" />
              <div className="flex items-center justify-start space-x-3">
                <CartButton
                  onClick={() => {
                    router.push("/cart");
                    setIsMenuOpen(false);
                  }}
                />
                <span className="text-foreground">Cart</span>
              </div>

              {/* User account options for mobile */}
              <div className="border-t my-2" />
              <Link href="/auth/login" passHref>
                <Button
                  className="w-full mb-2 flex items-center justify-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/auth/signup" passHref>
                <Button
                  className="w-full mb-2 flex items-center justify-center space-x-2"
                  variant="outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </Button>
              </Link>
              <Link
                href="/account"
                className="w-full text-left px-4 py-2 hover:bg-accent rounded flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>My Account</span>
              </Link>
              <Link
                href="/account?tab=orders"
                className="w-full text-left px-4 py-2 hover:bg-accent rounded flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-4 w-4" />
                <span>My Orders</span>
              </Link>
              <Link
                href="/account?tab=wishlist"
                className="w-full text-left px-4 py-2 hover:bg-accent rounded flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>My Wishlist</span>
              </Link>
              <Link
                href="/account?tab=settings"
                className="w-full text-left px-4 py-2 hover:bg-accent rounded flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <div className="border-t my-2" />
              <Link
                href="/shipping-info"
                className="w-full text-left px-4 py-2 hover:bg-accent rounded flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Truck className="h-4 w-4" />
                <span>Track Order</span>
              </Link>
              <Button
                className="w-full mt-2 flex items-center justify-center space-x-2"
                variant="ghost"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserX className="h-4 w-4" />
                <span>Continue as Guest</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
