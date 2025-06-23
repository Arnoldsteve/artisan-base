// In packages/web/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, logoutUser } from '@/lib/api';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CreateStoreForm } from '@/components/dashboard/create-store-form';
import { ProductView } from '@/components/dashboard/product-view';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ... your data fetching logic here ...
    getProfile().then(setUser).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  if (isLoading) return <p className="p-4 pt-6">Loading...</p>;
  if (!user) return <p className="p-4 pt-6">Could not load user data.</p>;

  // This is the content that will be placed inside the DashboardLayout
  return (
    <>
      <div className="flex justify-between items-center mb-6 pt-6">
        <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <div>
        {user.store ? (
          <ProductView store={user.store} />
        ) : (
          <CreateStoreForm />
        )}
      </div>
    </>
  );
}