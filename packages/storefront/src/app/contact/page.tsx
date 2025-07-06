"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or need assistance? We'd love to hear from you. Send us
          a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Subject *
              </label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Customer Support</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="artisan">Become an Artisan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Message *
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                placeholder="Tell us how we can help you..."
                rows={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">hello@artisanbase.com</p>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">
                  Mon-Fri 9AM-6PM EST
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                <p className="text-muted-foreground">
                  123 Artisan Street
                  <br />
                  Craft District, CA 90210
                  <br />
                  United States
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Business Hours
                </h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  How do I become an artisan partner?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Contact us with details about your craft and we'll guide you
                  through the application process.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  What's your return policy?
                </h4>
                <p className="text-xs text-muted-foreground">
                  We offer a 30-day return policy for all products in their
                  original condition.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  Do you ship internationally?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Yes, we ship to most countries. Shipping costs and delivery
                  times vary by location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
