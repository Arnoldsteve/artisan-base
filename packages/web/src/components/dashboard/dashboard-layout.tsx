// In packages/web/src/components/dashboard/dashboard-layout.tsx
'use client'; // This component now uses a hook, so it must be a client component

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import the hook
import clsx from 'clsx'; // Import the helper

// You can define your navigation links in an array for easy management
const navLinks = [
  { href: '/dashboard', label: 'Products' },
  { href: '/dashboard/orders', label: 'Orders' },
  // Add more links here in the future, e.g., { href: '/dashboard/settings', label: 'Settings' }
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current URL path

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span>ArtisanBase</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // Use clsx to conditionally apply styles
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                    {
                      'bg-muted text-primary': pathname === link.href, // This is the active style
                      'text-muted-foreground': pathname !== link.href, // This is the inactive style
                    }
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden">
          {/* Mobile navigation can be added here */}
          <h1 className="font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}