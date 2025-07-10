// REFACTOR: Footer component with optimized structure and performance

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  A
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Artisan Base
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting talented artisans with customers who appreciate
              handcrafted excellence.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/categories"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/featured"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Featured Items
              </Link>
              <Link
                href="/new-arrivals"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Customer Service</h3>
            <nav className="space-y-2">
              <Link
                href="/help-center"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/shipping-info"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns-exchanges"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@artisanbase.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Artisan St, Craft City, CC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Artisan Base. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
