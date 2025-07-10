import { HelpPageLayout } from "@/components/help/help-page-layout";
import { Button } from "@repo/ui/components/ui/button";

export default function ShippingInfoPage() {
  return (
    <HelpPageLayout title="Shipping Information">
      <h2>Shipping Methods</h2>
      <ul>
        <li>Standard Shipping: 5-7 business days</li>
        <li>Express Shipping: 2-3 business days</li>
        <li>Overnight Shipping: 1 business day</li>
      </ul>
      <p>
        We process orders within 1-2 business days. Shipping times are estimates
        and may vary.
      </p>
      <div className="mt-6">
        <Button asChild>
          <a href="/help-center">Back to Help Center</a>
        </Button>
      </div>
    </HelpPageLayout>
  );
}
