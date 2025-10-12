"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              Welcome to Artisan Base
            </span>
          </motion.div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Discover Unique{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Handcrafted
            </span>{" "}
            Treasures
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
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

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quality Guaranteed</h3>
              <p className="mt-2 text-sm text-gray-600">
                Every product is carefully vetted for excellence
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fast Delivery</h3>
              <p className="mt-2 text-sm text-gray-600">
                Quick and secure shipping to your doorstep
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Artisan Support</h3>
              <p className="mt-2 text-sm text-gray-600">
                Supporting local craftspeople and communities
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}