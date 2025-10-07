// packages/storefront/src/components/star-rating.tsx
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number; // e.g. 4.2
}

export default function StarRating({ rating = 0 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {" "}
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}
