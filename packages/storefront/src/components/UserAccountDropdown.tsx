import React, { useCallback } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import {
  LogIn,
  UserPlus,
  User,
  Package,
  Heart,
  Settings,
  Search,
  UserCheck,
} from "lucide-react";

interface UserAccountDropdownProps {
  open: boolean;
  onClose: () => void;
}

export const UserAccountDropdown: React.FC<UserAccountDropdownProps> = ({
  open,
  onClose,
}) => {
  // Close dropdown on navigation
  const handleNav = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      className={`absolute right-0 mt-2 w-64 bg-background border border-input rounded-lg shadow-lg z-50 transition-all duration-200 origin-top-right ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
      style={{ minWidth: 220 }}
      tabIndex={-1}
      aria-hidden={!open}
    >
      <div className="py-2 px-2">
        <Button
          className="w-full mb-2 flex items-center gap-3 justify-start"
          onClick={handleNav}
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
        <Button
          className="w-full mb-2 flex items-center gap-3 justify-start"
          variant="outline"
          onClick={handleNav}
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </Button>
        <div className="border-t my-2" />
        <Link
          href="/account"
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-accent text-foreground transition-colors"
          onClick={handleNav}
        >
          <User className="w-4 h-4" />
          My Account
        </Link>
        <Link
          href="/account?tab=orders"
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-accent text-foreground transition-colors"
          onClick={handleNav}
        >
          <Package className="w-4 h-4" />
          My Orders
        </Link>
        <Link
          href="/account?tab=wishlist"
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-accent text-foreground transition-colors"
          onClick={handleNav}
        >
          <Heart className="w-4 h-4" />
          My Wishlist
        </Link>
        <Link
          href="/account?tab=settings"
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-accent text-foreground transition-colors"
          onClick={handleNav}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="border-t my-2" />
        <Link
          href="/shipping-info"
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-accent text-foreground transition-colors"
          onClick={handleNav}
        >
          <Search className="w-4 h-4" />
          Track Order
        </Link>
        <Button
          className="w-full mt-2 flex items-center gap-3 justify-start"
          variant="ghost"
          onClick={handleNav}
        >
          <UserCheck className="w-4 h-4" />
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};