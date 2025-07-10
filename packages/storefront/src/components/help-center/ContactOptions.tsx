import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";

const contacts = [
  {
    title: "Live Chat",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <rect x="2" y="6" width="24" height="16" rx="4" fill="#f59e0b" />
        <circle cx="8" cy="14" r="2" fill="#fff" />
        <circle cx="14" cy="14" r="2" fill="#fff" />
        <circle cx="20" cy="14" r="2" fill="#fff" />
      </svg>
    ),
    desc: "Chat with a support specialist",
    status: "Available now",
    button: "Start Chat",
    href: "#chat",
  },
  {
    title: "Email Support",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <rect x="2" y="6" width="24" height="16" rx="4" fill="#2563eb" />
        <path d="M4 8l10 8 10-8" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
    desc: "Response within 24 hours",
    status: null,
    button: "Send Email",
    href: "mailto:support@example.com",
  },
  {
    title: "Phone Support",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <rect x="6" y="2" width="16" height="24" rx="8" fill="#a78bfa" />
        <rect x="10" y="20" width="8" height="4" rx="2" fill="#fff" />
      </svg>
    ),
    desc: "Mon-Fri 8AM-8PM EST",
    status: null,
    button: "Call Now",
    href: "tel:1-800-555-1234",
  },
  {
    title: "Community Forum",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="#10b981" />
        <rect x="8" y="10" width="12" height="8" rx="2" fill="#fff" />
      </svg>
    ),
    desc: "Ask the community, get answers",
    status: "Active discussions",
    button: "Join Discussion",
    href: "#community",
  },
];

export function ContactOptions() {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Contact Options
      </h3>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8">
        {contacts.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-xl border shadow p-6 flex flex-col items-center gap-2"
            style={{ borderRadius: 12, borderWidth: 1 }}
          >
            <div className="mb-2">{c.icon}</div>
            <div className="font-bold text-lg mb-1 text-center">{c.title}</div>
            <div className="text-sm text-gray-600 mb-1 text-center">
              {c.desc}
            </div>
            {c.status && (
              <div className="text-xs font-medium mb-1 text-center">
                {c.status}
              </div>
            )}
            <Button asChild size="sm" className="w-full mt-1">
              <a href={c.href}>{c.button}</a>
            </Button>
          </div>
        ))}
      </div>
      <div
        className="bg-white rounded-xl border shadow p-6 max-w-lg mx-auto"
        style={{ borderRadius: 12, borderWidth: 1 }}
      >
        <h4 className="font-semibold mb-2">Quick Contact Form</h4>
        <form className="flex flex-col gap-3">
          <Input placeholder="Your Name" required />
          <Input placeholder="Your Email" type="email" required />
          <select className="border rounded px-3 py-2 text-sm" required>
            <option value="">Select Subject</option>
            <option>Order Issue</option>
            <option>Return/Exchange</option>
            <option>Shipping Question</option>
            <option>Account Help</option>
            <option>Other</option>
          </select>
          <textarea
            className="border rounded px-3 py-2 text-sm min-h-[80px]"
            placeholder="How can we help you?"
            required
          />
          <Button type="submit" className="mt-2">
            Send Message
          </Button>
        </form>
        <div className="text-xs text-gray-400 mt-2">
          Expected response time: within 24 hours
        </div>
      </div>
    </section>
  );
}
