"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Share2 } from "lucide-react";

interface ShopHeroProps {
  bannerImage?: string;
}

export function ShopHero({ bannerImage }: ShopHeroProps) {
  // const defaultBanner = "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1600&q=80";

  return (
    <div className="relative h-[250px] md:h-[350px] w-full bg-slate-200 overflow-hidden">
      <img 
        src={bannerImage} 
        className="w-full h-full object-cover"
        alt="Artisan Shop Banner"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-6 right-6">
        <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/40">
          <Share2 className="w-4 h-4 mr-2" /> Share Shop
        </Button>
      </div>
    </div>
  );
}