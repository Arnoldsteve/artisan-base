'use client';

import { DataTable } from '@repo/ui';

const columns: { key: 'name' | 'price'; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
];

const rows = [
  { name: 'Smoothie', price: '$5.00' },
  { name: 'Juice', price: '$4.50' },
];

export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Product Table</h1>
      <DataTable columns={columns} rows={rows} />
    </main>
  );
}
