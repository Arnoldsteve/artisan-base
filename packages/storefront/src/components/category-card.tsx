import Image from "next/image";
import React from "react";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

const getCategoryImage = (category: Category) => {
  return category.image
    ? category.image
    : `https://picsum.photos/400/200?random=${category.id}`;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="relative w-full h-32">
        {category.image ? (
          <Image
            src={getCategoryImage(category)}
            alt={category.name}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="relative w-full h-32">
              <Image
                src={
                  category.image &&
                  category.image.trim() &&
                  category.image !== "null"
                    ? category.image
                    : `https://picsum.photos/400/200?random=${category.id}`
                }
                alt={category.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 text-start">
        <h3 className="font-semibold text-foreground text-lg mb-2">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {category.description}
          </p>
        )}
        <span className="text-sm text-muted-foreground">
          {category._count?.products || 0} product
          {category._count?.products !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
