import { ProductCard } from "./product-card";

// Extended mock data for the products page
const mockProducts = [
  {
    id: "1",
    name: "Handcrafted Ceramic Vase",
    price: 89.99,
    image: "https://picsum.photos/400/400?random=1",
    category: "Home & Garden",
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Artisan Wooden Cutting Board",
    price: 45.0,
    image: "https://picsum.photos/400/400?random=2",
    category: "Kitchen",
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Handwoven Cotton Throw",
    price: 65.5,
    image: "https://picsum.photos/400/400?random=3",
    category: "Home & Garden",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "4",
    name: "Leather Journal",
    price: 32.99,
    image: "https://picsum.photos/400/400?random=4",
    category: "Stationery",
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: "5",
    name: "Handmade Soap Set",
    price: 28.0,
    image: "https://picsum.photos/400/400?random=5",
    category: "Beauty",
    rating: 4.9,
    reviewCount: 67,
  },
  {
    id: "6",
    name: "Ceramic Mug Set",
    price: 38.5,
    image: "https://picsum.photos/400/400?random=6",
    category: "Kitchen",
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: "7",
    name: "Hand-knitted Scarf",
    price: 42.0,
    image: "https://picsum.photos/400/400?random=7",
    category: "Fashion",
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: "8",
    name: "Wooden Picture Frame",
    price: 55.0,
    image: "https://picsum.photos/400/400?random=8",
    category: "Home & Garden",
    rating: 4.5,
    reviewCount: 76,
  },
  {
    id: "9",
    name: "Handmade Candles",
    price: 24.99,
    image: "https://picsum.photos/400/400?random=9",
    category: "Home & Garden",
    rating: 4.8,
    reviewCount: 113,
  },
];

export function ProductsGrid() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {mockProducts.length} products
        </p>
        <select className="border rounded-md px-3 py-1 text-sm">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
          <option>Best Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm border rounded-md hover:bg-accent">
            Previous
          </button>
          <button className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md">
            1
          </button>
          <button className="px-3 py-2 text-sm border rounded-md hover:bg-accent">
            2
          </button>
          <button className="px-3 py-2 text-sm border rounded-md hover:bg-accent">
            3
          </button>
          <button className="px-3 py-2 text-sm border rounded-md hover:bg-accent">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
