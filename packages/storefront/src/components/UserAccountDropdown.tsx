import React, { useCallback } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

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
        <Button className="w-full mb-2" onClick={handleNav}>
          Sign In
        </Button>
        <Button className="w-full mb-2" variant="outline" onClick={handleNav}>
          Create Account
        </Button>
        <div className="border-t my-2" />
        <Link
          href="/account"
          className="block px-4 py-2 rounded hover:bg-accent text-foreground"
          onClick={handleNav}
        >
          My Account
        </Link>
        <Link
          href="/account?tab=orders"
          className="block px-4 py-2 rounded hover:bg-accent text-foreground"
          onClick={handleNav}
        >
          My Orders
        </Link>
        <Link
          href="/account?tab=wishlist"
          className="block px-4 py-2 rounded hover:bg-accent text-foreground"
          onClick={handleNav}
        >
          My Wishlist
        </Link>
        <Link
          href="/account?tab=settings"
          className="block px-4 py-2 rounded hover:bg-accent text-foreground"
          onClick={handleNav}
        >
          Settings
        </Link>
        <div className="border-t my-2" />
        <Link
          href="/track-order"
          className="block px-4 py-2 rounded hover:bg-accent text-foreground"
          onClick={handleNav}
        >
          Track Order
        </Link>
        <Button className="w-full mt-2" variant="ghost" onClick={handleNav}>
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};
