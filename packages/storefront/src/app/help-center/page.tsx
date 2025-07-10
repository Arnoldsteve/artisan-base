import { HelpPageLayout } from "@/components/help/help-page-layout";
import { Button } from "@repo/ui/components/ui/button";

export default function HelpCenterPage() {
  return (
    <HelpPageLayout title="Help Center">
      <p>
        Welcome to our Help Center. Find answers to common questions, shipping
        info, and our return policy below.
      </p>
      <ul>
        <li>
          <a href="/shipping-info" className="text-blue-600 underline">
            Shipping Info
          </a>
        </li>
        <li>
          <a href="/returns-exchanges" className="text-blue-600 underline">
            Returns & Exchanges
          </a>
        </li>
      </ul>
      <div className="mt-6">
        <Button asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </HelpPageLayout>
  );
}
