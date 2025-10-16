"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  size?: "small" | "medium" | "large";
  showValue?: boolean;
}

const sizeMap = {
  small: 14,
  medium: 18,
  large: 24,
};

export default function StarRating({
  rating = 0,
  editable = false,
  onChange,
  size = "medium",
  showValue = true,
}: StarRatingProps) {
  const starSize = sizeMap[size];

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
              size={starSize}
            />
          </button>
        );
      })}
      {showValue && (
        <span
          className={`text-muted-foreground ${
            size === "small"
              ? "text-xs"
              : size === "medium"
                ? "text-sm"
                : "text-base"
          }`}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
