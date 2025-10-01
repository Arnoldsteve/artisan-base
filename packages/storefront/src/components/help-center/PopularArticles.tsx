"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const articles = [
  {
    title: "How to track your order",
    excerpt:
      "Learn how to check your order status and get real-time delivery updates.",
    readTime: "2 min read",
    helpful: 42,
    trending: true,
    updated: false,
  },
  {
    title: "Return policy details",
    excerpt:
      "Understand our return policy, eligibility, and how to start a return.",
    readTime: "3 min read",
    helpful: 37,
    trending: false,
    updated: true,
  },
  {
    title: "Accepted payment methods",
    excerpt:
      "See which payment options are available and how to update your info.",
    readTime: "2 min read",
    helpful: 29,
    trending: true,
    updated: false,
  },
  {
    title: "How to reset your password",
    excerpt: "Step-by-step guide to resetting your account password securely.",
    readTime: "1 min read",
    helpful: 18,
    trending: false,
    updated: true,
  },
  {
    title: "Shipping methods and costs",
    excerpt:
      "Compare shipping options, delivery times, and costs for your order.",
    readTime: "2 min read",
    helpful: 24,
    trending: true,
    updated: false,
  },
  {
    title: "Product warranty information",
    excerpt: "Find out about product warranties and how to make a claim.",
    readTime: "2 min read",
    helpful: 12,
    trending: false,
    updated: false,
  },
];

export function PopularArticles() {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Most Popular Articles
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Card
            key={a.title}
            className="hover:shadow-lg transition-shadow pt-3"
          >
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg text-blue-700 hover:underline cursor-pointer">
                  {a.title}
                </span>
                {a.trending && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-700 rounded px-2 py-0.5">
                    Trending
                  </span>
                )}
                {a.updated && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 rounded px-2 py-0.5">
                    Updated
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1 line-clamp-2">
                {a.excerpt}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{a.readTime}</span>
                <span>·</span>
                <span>{a.helpful} found this helpful</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="text-gray-400 hover:text-blue-700"
                  aria-label="Thumbs up"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-blue-700"
                  aria-label="Thumbs down"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
