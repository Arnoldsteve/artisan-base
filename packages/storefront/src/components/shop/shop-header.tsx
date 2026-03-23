"use client";

import { MapPin, Star, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";

interface ShopHeaderProps {
  name: string;
  logo?: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export function ShopHeader({ name, logo, location, rating, reviewCount }: ShopHeaderProps) {
  return (
    <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6 pb-8 border-b">
      <div className="relative h-32 w-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-2xl shrink-0">
        <img src={logo || "/placeholder-logo.png"} className="w-full h-full object-cover" alt={name} />
      </div>

      <div className="flex-1 space-y-2 pt-8">
        <div className="flex items-center gap-3 pt-4">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 capitalize">{name}</h1>
          <Badge className="bg-blue-600 rounded-full">Verified Artisan</Badge>
        </div>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> {location}</div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 
            <span className="text-slate-900 font-bold">{rating}</span> 
            <span>({reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pb-2 w-full md:w-auto">
        <Button variant="outline" className="flex-1 md:flex-none font-bold">
          <MessageCircle className="w-4 h-4 mr-2" /> Message
        </Button>
        <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 font-bold px-8">
          Follow
        </Button>
      </div>
    </div>
  );
}