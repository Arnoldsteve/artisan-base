import React from "react";

const categories = [
  {
    title: "Orders & Shipping",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="2" y="12" width="20" height="10" rx="3" fill="#2563eb" /><rect x="22" y="16" width="8" height="6" rx="2" fill="#6b7280" /><circle cx="8" cy="26" r="3" fill="#2563eb" /><circle cx="26" cy="26" r="3" fill="#2563eb" /></svg>
    ),
    description: "Track orders, shipping methods, and delivery info",
    articles: 12,
    topics: [
      "How to track my order",
      "Shipping methods and costs",
      "Order processing times",
      "Delivery issues",
    ],
    href: "/shipping-info",
  },
  {
    title: "Returns & Exchanges",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 4v24M16 4l-6 6M16 4l6 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" /><rect x="6" y="16" width="20" height="10" rx="3" fill="#10b981" /></svg>
    ),
    description: "Return policy, exchange process, and refunds",
    articles: 8,
    topics: [
      "How to return an item",
      "Return policy details",
      "Exchange process",
      "Refund timelines",
    ],
    href: "/returns-exchanges",
  },
  {
    title: "Account & Profile",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="12" r="6" fill="#2563eb" /><rect x="6" y="20" width="20" height="8" rx="4" fill="#6b7280" /></svg>
    ),
    description: "Manage your account, passwords, and preferences",
    articles: 15,
    topics: [
      "Reset password",
      "Update profile information",
      "Manage email preferences",
      "Delete account",
    ],
    href: "#account",
  },
  {
    title: "Payment & Billing",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" rx="4" fill="#f59e0b" /><rect x="8" y="16" width="16" height="4" rx="2" fill="#fff" /></svg>
    ),
    description: "Payment methods, billing, and transaction issues",
    articles: 10,
    topics: [
      "Accepted payment methods",
      "Payment failed solutions",
      "Update payment info",
      "Billing questions",
    ],
    href: "#payment",
  },
  {
    title: "Products & Services",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="4" fill="#10b981" /><rect x="12" y="20" width="8" height="4" rx="2" fill="#fff" /></svg>
    ),
    description: "Product information, warranties, and features",
    articles: 20,
    topics: [
      "Product specifications",
      "Warranty information",
      "Product care guides",
      "Size guides",
    ],
    href: "#products",
  },
  {
    title: "Technical Support",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#a78bfa" /><rect x="12" y="12" width="8" height="8" rx="2" fill="#fff" /></svg>
    ),
    description: "Website issues, app problems, and technical help",
    articles: 7,
    topics: [
      "Website not loading",
      "Mobile app issues",
      "Browser compatibility",
      "Clear cache and cookies",
    ],
    href: "#tech",
  },
];

export function CategoryGrid() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
      {categories.map((cat) => (
        <a
          key={cat.title}
          href={cat.href}
          className="bg-white rounded-xl border shadow p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ borderRadius: 12, borderWidth: 1 }}
        >
          <div className="flex items-center gap-3 mb-2">{cat.icon}<span className="font-bold text-lg">{cat.title}</span></div>
          <div className="text-sm text-gray-600 mb-1">{cat.description}</div>
          <div className="text-xs text-gray-400 mb-1">{cat.articles} articles</div>
          <ul className="list-disc ml-5 text-xs text-gray-500">
            {cat.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </a>
      ))}
    </div>
  );
} 