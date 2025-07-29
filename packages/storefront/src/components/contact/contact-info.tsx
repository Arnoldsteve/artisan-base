import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-6">
          We're here to help and answer any questions you might have. We look
          forward to hearing from you.
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
              We offer a 30-day return policy for all products in their original
              condition.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">
              Do you ship internationally?
            </h4>
            <p className="text-xs text-muted-foreground">
              Yes, we ship to most countries. Shipping costs and delivery times
              vary by location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}