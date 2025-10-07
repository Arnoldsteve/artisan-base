"use client";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export default function ContactPage() {
  return (
    <section className="bg-[#f4f4f4]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-start mb-12">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Contact Us
          </h1>
          <p className="text-sm text-muted-foreground">
            Have questions or need assistance? We'd love to hear from you. Send
            us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
