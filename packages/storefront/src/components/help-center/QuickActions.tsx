import React from "react";
import { Button } from "@repo/ui/components/ui/button";

const actions = [
  {
    title: "Track Your Order",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect x="2" y="12" width="20" height="10" rx="3" fill="#2563eb" />
        <rect x="22" y="16" width="8" height="6" rx="2" fill="#6b7280" />
        <circle cx="8" cy="26" r="3" fill="#2563eb" />
        <circle cx="26" cy="26" r="3" fill="#2563eb" />
      </svg>
    ),
    description: "Check order status and delivery updates",
    button: "Track Order",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    href: "/shipping-info?tab=track",
  },
  {
    title: "Start a Return",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <path
          d="M16 4v24M16 4l-6 6M16 4l6 6"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="6" y="16" width="20" height="10" rx="3" fill="#10b981" />
      </svg>
    ),
    description: "Easy returns within 30 days",
    button: "Return Item",
    color: "bg-green-50 border-green-200 text-green-700",
    href: "/returns-exchanges?tab=start-return",
  },
  {
    title: "Live Chat",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect x="4" y="8" width="24" height="16" rx="4" fill="#f59e0b" />
        <circle cx="10" cy="16" r="2" fill="#fff" />
        <circle cx="16" cy="16" r="2" fill="#fff" />
        <circle cx="22" cy="16" r="2" fill="#fff" />
      </svg>
    ),
    description: "Chat with our support team",
    button: "Start Chat",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    href: "#chat",
    status: "Available now",
  },
  {
    title: "Call Support",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect x="8" y="4" width="16" height="24" rx="8" fill="#a78bfa" />
        <rect x="12" y="24" width="8" height="4" rx="2" fill="#fff" />
      </svg>
    ),
    description: "Speak with a specialist",
    button: "Call (1-800-555-1234)",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    href: "tel:1-800-555-1234",
    status: "Mon-Fri 8AM-8PM EST",
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-6 justify-center mb-10">
      {actions.map((action) => (
        <div
          key={action.title}
          className={`w-[260px] bg-white rounded-xl border shadow p-6 flex flex-col items-center gap-3 ${action.color} hover:shadow-lg transition-shadow`}
          style={{ borderRadius: 12, borderWidth: 1 }}
        >
          <div className="mb-2">{action.icon}</div>
          <div className="font-bold text-lg mb-1 text-center">
            {action.title}
          </div>
          <div className="text-sm text-gray-600 mb-2 text-center">
            {action.description}
          </div>
          {action.status && (
            <div className="text-xs font-medium mb-1 text-center">
              {action.status}
            </div>
          )}
          <Button asChild size="sm" className="w-full mt-1">
            <a href={action.href}>{action.button}</a>
          </Button>
        </div>
      ))}
    </div>
  );
}
