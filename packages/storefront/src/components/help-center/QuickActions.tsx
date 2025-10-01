"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Package, ArrowRight, MessageCircle, Phone } from "lucide-react";

const actions = [
  {
    title: "Track Your Order",
    icon: <Package className="w-8 h-8 text-blue-600" />,
    description: "Check order status and delivery updates",
    button: "Track Order",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    href: "/shipping-info?tab=track",
  },
  {
    title: "Start a Return",
    icon: <ArrowRight className="w-8 h-8 text-green-600" />,
    description: "Easy returns within 30 days",
    button: "Return Item",
    color: "bg-green-50 border-green-200 text-green-700",
    href: "/returns-exchanges?tab=start-return",
  },
  {
    title: "Live Chat",
    icon: <MessageCircle className="w-8 h-8 text-orange-600" />,
    description: "Chat with our support team",
    button: "Start Chat",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    href: "#chat",
    status: "Available now",
  },
  {
    title: "Call Support",
    icon: <Phone className="w-8 h-8 text-purple-600" />,
    description: "Speak with a specialist",
    button: "Call +254 (796) 335-895",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    href: "tel:+254796335895",
    status: "Mon-Fri 8AM-8PM EAT",
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-6 justify-center mb-10">
      {actions.map((action) => (
        <div
          key={action.title}
          className={`w-[260px] bg-white rounded-xl border shadow p-6 flex flex-col justify-between gap-3 ${action.color} hover:shadow-lg transition-shadow`}
          style={{ minHeight: 220 }} // ensures all cards align
        >
          {/* Top content */}
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2">{action.icon}</div>
            <div className="font-bold text-lg mb-1 text-center">{action.title}</div>
            <div className="text-sm text-gray-600 mb-2 text-center">{action.description}</div>
            {action.status && (
              <div className="text-xs font-medium mb-1 text-center">{action.status}</div>
            )}
          </div>

          {/* Button at the bottom */}
          <Button asChild size="sm" className="w-full mt-3">
            <a href={action.href}>{action.button}</a>
          </Button>
        </div>
      ))}
    </div>
  );
}
