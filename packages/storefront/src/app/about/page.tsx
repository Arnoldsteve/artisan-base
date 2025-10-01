"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Star, Users, Leaf } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          About Artisan Base
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting artisans with customers worldwide through our curated
          marketplace of handcrafted products.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              At Artisan Base, we believe in the power of handcrafted goods and
              the stories they tell. Our mission is to provide a platform where
              skilled artisans can showcase their unique creations and connect
              with customers who appreciate quality craftsmanship.
            </p>
            <p>
              We're committed to supporting local artisans, preserving
              traditional crafts, and bringing beautiful, unique products to
              homes around the world.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/20 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle>Supporting Artisans</CardTitle>
          <CardContent className="text-sm text-muted-foreground pt-2">
            Every purchase directly supports independent artisans and their
            craft.
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            
            <CardTitle>Quality</CardTitle>
            <CardContent className="text-sm text-muted-foreground">
              We curate only the finest handcrafted products, ensuring
              exceptional quality and craftsmanship.
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Community</CardTitle>
            <CardContent className="text-sm text-muted-foreground">
              Building a community that connects artisans with customers who
              value unique, meaningful products.
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Sustainability</CardTitle>
            <CardContent className="text-sm text-muted-foreground">
              Promoting sustainable practices and supporting artisans who use
              eco-friendly materials.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Story Section */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4">
          <p>
            Artisan Base was founded with a simple vision: to create a
            marketplace where the beauty of handcrafted goods could reach
            customers worldwide. What started as a small collection of local
            artisans has grown into a thriving community of creators and
            collectors.
          </p>
          <p>
            Our journey began when we discovered the incredible talent of local
            artisans who were struggling to reach customers beyond their
            immediate communities. We realized that the internet could bridge
            this gap, connecting skilled craftspeople with customers who
            appreciate the time, effort, and love that goes into each handmade
            piece.
          </p>
          <p>
            Today, we're proud to support hundreds of artisans across the globe,
            helping them turn their passion into sustainable businesses while
            bringing unique, beautiful products to homes everywhere.
          </p>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Have questions about our platform or want to learn more about
            becoming an artisan partner?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
