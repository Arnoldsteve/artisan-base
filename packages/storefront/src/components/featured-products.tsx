import { ProductCard } from "./product-card";

// Mock data - in a real app, this would come from an API
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
];

export function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular handcrafted items, carefully selected for
            their quality, beauty, and craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
