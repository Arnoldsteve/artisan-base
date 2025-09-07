// REFACTOR: Header component with reactive navigation and improved accessibility

"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Package, Grid3X3, Info, Phone, Truck, UserX, Settings, Heart, UserPlus, LogIn } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { useProductSearch } from "@/hooks/use-products";
import { Product } from "@/types";
import { CartButton } from "@/components/cart/cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { UserAccountDropdown } from "./UserAccountDropdown";

// OPTIMIZATION: Debounced search hook for better performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // OPTIMIZATION: Debounced search to reduce API calls
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: searchResults = [], isLoading: isSearching } = useProductSearch(
    debouncedQuery,
    5
  );

  // OPTIMIZATION: Memoized search results to prevent unnecessary re-renders
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchResults.slice(0, 5);
  }, [searchResults, debouncedQuery]);

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
        // Navigate to search results page
        window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      }
    },
    [searchQuery]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
    if (isSearchOpen) {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isUserDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsUserDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isUserDropdownOpen]);

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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                A
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Artisan Base
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-foreground hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              {/* Search Results Dropdown */}
              {isSearchOpen && filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-lg shadow-lg z-50">
                  {filteredResults.map((product: Product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center space-x-3 p-3 hover:bg-accent transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <CartButton onClick={() => setCartOpen(true)} />
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
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
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
                <CartButton onClick={() => {
                  setCartOpen(true);
                  setIsMenuOpen(false);
                }} />
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
                href="/track-order"
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
