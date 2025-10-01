"use client";

import React from "react";
import { ShoppingCart, RefreshCcw, User, CreditCard, Box, Settings } from "lucide-react"; // replaced Tool with Settings

const categories = [
  {
    title: "Orders & Shipping",
    icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
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
    icon: <RefreshCcw className="w-8 h-8 text-green-600" />,
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
    icon: <User className="w-8 h-8 text-indigo-600" />,
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
    icon: <CreditCard className="w-8 h-8 text-yellow-600" />,
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
    icon: <Box className="w-8 h-8 text-green-600" />,
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
    icon: <Settings className="w-8 h-8 text-purple-600" />, // replaced Tool with Settings
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
          <div className="flex items-center gap-3 mb-2">
            {cat.icon}
            <span className="font-bold text-lg">{cat.title}</span>
          </div>
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
