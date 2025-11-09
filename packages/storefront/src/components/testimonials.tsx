// REFACTOR: Testimonials component with performance optimizations

import { memo } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    content:
      "The quality of these handcrafted pieces is absolutely incredible. Each item tells a story and adds such character to my designs.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Home Chef",
    content:
      "I love supporting artisans while getting beautiful, functional kitchen items. The cutting boards are works of art I use daily.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Gift Shop Owner",
    content:
      "My customers are always impressed by the unique pieces I source from Artisan Base. The craftsmanship is consistently outstanding.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Collector",
    content:
      "I've been collecting handcrafted items for years, and Artisan Base has the best curation of quality pieces I've found online.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Event Planner",
    content:
      "The ceramic pieces I ordered for a wedding were absolutely perfect. Each guest received a unique, beautiful favor.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Restaurant Owner",
    content:
      "Our restaurant uses Artisan Base pieces for both decoration and service. The quality and beauty enhance our dining experience.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=6",
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Artisans" },
  { value: "50K+", label: "Products Sold" },
  { value: "4.9★", label: "Average Rating" },
];

export const Testimonials = memo(function Testimonials() {
  return (
    <section className="py-16 bg-background bg-muted/100">
      <div className="container mx-auto px-4">
        <div className="text-start mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
