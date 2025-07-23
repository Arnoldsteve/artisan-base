import { notFound } from "next/navigation";
import CategoryCard from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { Category, Product } from "@/types";

interface CategoryPageProps {
  params: { id: string };
}

// Mock data
const mockCategory: Category = {
  id: "mock-category-id",
  name: "Mock Category",
  description: "This is a mock category for testing.",
  image: "",
  isActive: true,
};

const mockProducts: Product[] = [
  {
    id: "mock-product-1",
    name: "Mock Product 1",
    description: "A sample product.",
    price: 19.99,
    originalPrice: 29.99,
    image: "",
    images: [],
    category: "Mock Category",
    categoryId: "mock-category-id",
    rating: 4.5,
    reviewCount: 10,
    inventoryQuantity: 100,
    sku: "SKU-001",
    tags: ["mock", "test"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mock-product-2",
    name: "Mock Product 2",
    description: "Another sample product.",
    price: 9.99,
    originalPrice: 14.99,
    image: "",
    images: [],
    category: "Mock Category",
    categoryId: "mock-category-id",
    rating: 4.0,
    reviewCount: 5,
    inventoryQuantity: 50,
    sku: "SKU-002",
    tags: ["mock"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Use mock data for now
  const category = mockCategory;
  const products = mockProducts;

  console.log("Category:", category);
  console.log("Products:", products);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryCard category={category} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Products in {category.name}
        </h2>
        {products.length === 0 ? (
          <div className="text-muted-foreground">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
