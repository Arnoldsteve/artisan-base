"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden bg-[#f4f4f4]">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-[24rem] w-[24rem] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Discover Unique{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Handcrafted
            </span>{" "}
            Treasures
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Explore our curated selection of premium artisan goods. Each piece
            reflects craftsmanship, heritage, and passion — bringing warmth and
            character to your home.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 text-base">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 text-base">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
