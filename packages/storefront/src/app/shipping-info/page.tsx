import { ShippingHeader } from "@/components/shipping/ShippingHeader";
import { ShippingHero } from "@/components/shipping/ShippingHero";
import { ShippingTabs } from "@/components/shipping/ShippingTabs";

export default function ShippingInfoPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <ShippingHeader />
        <ShippingHero />
        <ShippingTabs />
      </div>
    </div>
  );
}
