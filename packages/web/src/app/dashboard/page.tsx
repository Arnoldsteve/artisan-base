'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api'; 

// Define a type for our user object for better type safety
interface UserProfile {
  id: string;
  email: string;
  store: {
    id: string;
    name: string;
  } | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Call the real API function now
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        // In a real app, you might redirect to login here
        // e.g., router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); // The empty dependency array means this runs once on component mount

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!user) {
    return <div className="p-8">Could not load user data. Please try logging in again.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2">You are logged in as: {user.email}</p>
      
      {/* We will add the logic for this part next */}
      {user.store ? (
        <p className="mt-4">Your store is: {user.store.name}</p>
      ) : (
        <p className="mt-4">You have not created a store yet.</p>
      )}
    </div>
  );
}