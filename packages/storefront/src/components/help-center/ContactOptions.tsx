import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { MessageCircle, Mail, Phone, Users } from "lucide-react";

const contacts = [
  {
    title: "Live Chat",
    icon: <MessageCircle className="w-8 h-8 text-yellow-500" />,
    desc: "Chat with a support specialist",
    status: "Available now",
    button: "Start Chat",
    href: "#chat",
  },
  {
    title: "Email Support",
    icon: <Mail className="w-8 h-8 text-blue-600" />,
    desc: "Response within 24 hours",
    status: null,
    button: "Send Email",
    href: "mailto:support@example.com",
  },
  {
    title: "Phone Support",
    icon: <Phone className="w-8 h-8 text-purple-600" />,
    desc: "Mon-Fri 8AM-8PM EST",
    status: null,
    button: "Call Now",
    href: "tel:1-800-555-1234",
  },
  {
    title: "Community Forum",
    icon: <Users className="w-8 h-8 text-green-600" />,
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
            className="bg-white rounded-xl border shadow p-6 flex flex-col justify-between"
            style={{ borderRadius: 12, borderWidth: 1, minHeight: 220 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="mb-2">{c.icon}</div>
              <div className="font-bold text-lg mb-1 text-center">{c.title}</div>
              <div className="text-sm text-gray-600 mb-1 text-center">{c.desc}</div>
              {c.status && (
                <div className="text-xs font-medium mb-1 text-center">{c.status}</div>
              )}
            </div>
            <Button asChild size="sm" className="w-full mt-3">
              <a href={c.href}>{c.button}</a>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
