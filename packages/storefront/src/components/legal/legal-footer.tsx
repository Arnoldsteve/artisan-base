// REFACTOR: Legal footer component with contact information and support access

import { LegalContactInfo } from "@/types/legal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";

interface LegalFooterProps {
  contactInfo: LegalContactInfo;
}

export function LegalFooter({ contactInfo }: LegalFooterProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}`;
  };

  const handlePhoneClick = () => {
    if (contactInfo.phone) {
      window.location.href = `tel:${contactInfo.phone}`;
    }
  };

  return (
    <Card className="mt-8 border-t-2">
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Methods */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Email</div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-primary"
                  onClick={handleEmailClick}
                >
                  {contactInfo.email}
                </Button>
              </div>
            </div>

            {contactInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-primary"
                    onClick={handlePhoneClick}
                  >
                    {contactInfo.phone}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Website</div>
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {contactInfo.website}
                </a>
              </div>
            </div>
          </div>

          {/* Address and Hours */}
          <div className="space-y-3">
            {contactInfo.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">
                    {contactInfo.address}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Response Time</div>
                <div className="text-sm text-muted-foreground">
                  Within 30 days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>For Legal Inquiries:</strong> Please include your name,
              contact information, and a detailed description of your question
              or concern.
            </p>
            <p>
              <strong>For Privacy Requests:</strong> Include your account
              information and specify the type of request (access, correction,
              deletion, etc.).
            </p>
            <p>
              <strong>For Cookie Preferences:</strong> You can manage your
              cookie settings through your browser or contact us for assistance.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={handleEmailClick}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          {contactInfo.phone && (
            <Button variant="outline" size="sm" onClick={handlePhoneClick}>
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print This Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
