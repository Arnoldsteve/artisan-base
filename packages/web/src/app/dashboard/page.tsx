// In packages/web/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api';
import { CreateStoreForm } from '@/components/dashboard/create-store-form';
import { ProductView } from '@/components/dashboard/product-view';
import { UserProfile } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Could not load user data. Please try logging in again.</div>;
  }

 return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
      <div className="mt-6">
        {user.store ? (
          <ProductView store={user.store} /> 
        ) : (
          <CreateStoreForm />
        )}
      </div>
    </div>
  );
}