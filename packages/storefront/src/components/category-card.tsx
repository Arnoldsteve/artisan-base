import Image from "next/image";
import React from "react";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

const getCategoryImage = (category: Category) => {
  return category.image
    ? category.image
    : `https://picsum.photos/400/400?random=${category.id}`;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 flex flex-col items-center">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative mb-4">
        {category.image ? (
          <Image
            src={getCategoryImage(category)}
            alt={category.name}
            width={400}
            height={300}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-foreground text-xl mb-2">{category.name}</h3>
      {category.description && (
        <p className="text-sm text-muted-foreground mb-3 text-center">
          {category.description}
        </p>
      )}
      <span className="text-sm text-muted-foreground">
        {category._count?.products || 0} product
        {category._count?.products !== 1 ? "s" : ""}
      </span>
    </div>
  );
} 