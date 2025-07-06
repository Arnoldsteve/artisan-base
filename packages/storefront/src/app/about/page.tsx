export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          About Artisan Base
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting artisans with customers worldwide through our curated
          marketplace of handcrafted products.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Our Mission
          </h2>
          <p className="text-muted-foreground mb-4">
            At Artisan Base, we believe in the power of handcrafted goods and
            the stories they tell. Our mission is to provide a platform where
            skilled artisans can showcase their unique creations and connect
            with customers who appreciate quality craftsmanship.
          </p>
          <p className="text-muted-foreground">
            We're committed to supporting local artisans, preserving traditional
            crafts, and bringing beautiful, unique products to homes around the
            world.
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-primary-foreground">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Supporting Artisans
            </h3>
            <p className="text-sm text-muted-foreground">
              Every purchase directly supports independent artisans and their
              craft.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">✨</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Quality</h3>
            <p className="text-sm text-muted-foreground">
              We curate only the finest handcrafted products, ensuring
              exceptional quality and craftsmanship.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Building a community that connects artisans with customers who
              value unique, meaningful products.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🌱</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Sustainability
            </h3>
            <p className="text-sm text-muted-foreground">
              Promoting sustainable practices and supporting artisans who use
              eco-friendly materials.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-card border rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            Artisan Base was founded with a simple vision: to create a
            marketplace where the beauty of handcrafted goods could reach
            customers worldwide. What started as a small collection of local
            artisans has grown into a thriving community of creators and
            collectors.
          </p>
          <p className="text-muted-foreground mb-4">
            Our journey began when we discovered the incredible talent of local
            artisans who were struggling to reach customers beyond their
            immediate communities. We realized that the internet could bridge
            this gap, connecting skilled craftspeople with customers who
            appreciate the time, effort, and love that goes into each handmade
            piece.
          </p>
          <p className="text-muted-foreground">
            Today, we're proud to support hundreds of artisans across the globe,
            helping them turn their passion into sustainable businesses while
            bringing unique, beautiful products to homes everywhere.
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-6">
          Have questions about our platform or want to learn more about becoming
          an artisan partner?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
}
