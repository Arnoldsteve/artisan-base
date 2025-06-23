import React from 'react';
import { CartIcon } from './cart-icon'; // <-- Import


interface PublicLayoutProps {
  storeName: string;
  children: React.ReactNode;
}

export function PublicLayout({ storeName, children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold tracking-tight">{storeName}</h1>
          <CartIcon />
          {/* Future navigation links can go here (e.g., Cart, About) */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t">
        <div className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="mt-1">Powered by ArtisanBase</p>
        </div>
      </footer>
    </div>
  );
}