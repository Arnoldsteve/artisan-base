"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >

          <p className="leading-relaxed text-gray-600 sm:text-xl">
            Explore our curated selection of premium artisan goods. Each piece
            reflects craftsmanship, heritage, and passion — bringing warmth and
            character to your home.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="default" asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 text-base border-gray-300 hover:border-blue-300 hover:bg-blue-50">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}