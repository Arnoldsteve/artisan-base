
// The structure for an image object, as it might be stored in the JSONB field
export interface ProductImage {
  id: string; // A unique ID for the image
  url: string;
  altText?: string;
}

// The main Product type, matching your Prisma schema
export interface Product {
  id: string;
  name: string;
  price: number; // Prisma's Decimal becomes number in JS/TS
  inventoryQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[]; // The JSONB field is typed as an array of image objects
  createdAt: string; // Or Date, depending on serialization
}