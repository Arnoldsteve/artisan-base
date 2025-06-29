import { Product } from '@/types/products';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Ergonomic Office Chair',
    price: 299.99,
    inventoryQuantity: 25,
    isActive: true,
    isFeatured: true,
    images: [{ id: 'img_1', url: 'https://picsum.photos/seed/chair/400/400' }],
    createdAt: '2023-10-01T10:00:00Z',
  },
  {
    id: 'prod_2',
    name: 'Wireless Mechanical Keyboard',
    price: 129.50,
    inventoryQuantity: 50,
    isActive: true,
    isFeatured: false,
    images: [{ id: 'img_2', url: 'https://picsum.photos/seed/keyboard/400/400' }],
    createdAt: '2023-09-15T14:30:00Z',
  },
  {
    id: 'prod_3',
    name: '4K Ultra-Wide Monitor',
    price: 799.00,
    inventoryQuantity: 10,
    isActive: true,
    isFeatured: true,
    images: [{ id: 'img_3', url: 'https://picsum.photos/seed/monitor/400/400' }],
    createdAt: '2023-09-20T09:15:00Z',
  },
  {
    id: 'prod_4',
    name: 'Standing Desk Converter',
    price: 199.00,
    inventoryQuantity: 0, // Out of stock
    isActive: true,
    isFeatured: false,
    images: [{ id: 'img_4', url: 'https://picsum.photos/seed/desk/400/400' }],
    createdAt: '2023-08-24T18:00:00Z',
  },
  {
    id: 'prod_5',
    name: 'Premium Leather Mousepad',
    price: 45.00,
    inventoryQuantity: 150,
    isActive: false, // Inactive/Draft product
    isFeatured: false,
    images: [{ id: 'img_5', url: 'https://picsum.photos/seed/mousepad/400/400' }],
    createdAt: '2023-07-11T11:45:00Z',
  },
];