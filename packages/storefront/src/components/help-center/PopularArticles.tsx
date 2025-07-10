import React from "react";

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
        {articles.map((a, i) => (
          <div
            key={a.title}
            className="bg-white rounded-xl border shadow p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow"
            style={{ borderRadius: 12, borderWidth: 1 }}
          >
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
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <path
                    d="M6 15V7.5L10.5 3l.5 1.5h3A1.5 1.5 0 0 1 15.5 6v6A1.5 1.5 0 0 1 14 13.5H7.5L6 15Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <button
                className="text-gray-400 hover:text-blue-700"
                aria-label="Thumbs down"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <path
                    d="M12 3v7.5L7.5 15l-.5-1.5h-3A1.5 1.5 0 0 1 2.5 12V6A1.5 1.5 0 0 1 4 4.5h6.5L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
