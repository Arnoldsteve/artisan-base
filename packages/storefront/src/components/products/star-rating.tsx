"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  size?: number;
  showValue?: boolean;
}

export default function StarRating({
  rating = 0,
  editable = false,
  onChange,
  size = 16,
  showValue = true,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (editable && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={!editable}
            className={`transition-transform ${
              editable ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
          >
            <Star
              className={`${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              size={size}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-xs text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
