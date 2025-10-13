"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { reviewSchema, ReviewSchema } from "@/validation-schemas/review";
import StarRating from "./star-rating";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Label } from "@repo/ui/components/ui/label";
import { useAuthContext } from "@/contexts/auth-context";
import { reviewService } from "@/services/review";

interface CustomerReviewSectionProps {
  product: {
    id: string;
    name: string;
    rating?: number;
    reviewCount?: number;
  };
}

export const CustomerReviewSection: React.FC<CustomerReviewSectionProps> = ({
  product,
}) => {
  const { user, isAuthenticated } = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: product.id,
      rating: 0,
      reviewText: "",
    },
  });

  const rating = watch("rating");

  const onSubmit = async (data: ReviewSchema) => {
    if (!isAuthenticated || !user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const payload: ReviewSchema = {
      ...data,
      userId: user.id, // attach logged-in user ID
    };

    try {
      const createdReview = await reviewService.createReview(payload);
      console.log("Review created:", createdReview);

      // reset form
      setValue("rating", 0);
      setValue("reviewText", "");
      // Optionally, update product rating/reviewCount locally here
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

      <div className="flex items-center space-x-3 mb-6">
        <StarRating rating={product.rating || 0} />
        <span className="text-sm text-muted-foreground">
          {product.rating ? product.rating.toFixed(1) : "No ratings yet"}
          {product.reviewCount ? ` (${product.reviewCount} reviews)` : ""}
        </span>
      </div>

      <Card className="mb-8 shadow-none">
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">
            No reviews yet. Be the first to leave one!
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <Label>Your Rating</Label>
              <div className="mt-2">
                <StarRating
                  rating={rating}
                  editable
                  onChange={(value) =>
                    setValue("rating", value, { shouldValidate: true })
                  }
                />
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <Label>Your Review</Label>
              <Textarea
                placeholder="Share your thoughts about this product..."
                className="mt-2"
                {...register("reviewText")}
              />
              {errors.reviewText && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.reviewText.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!rating || !watch("reviewText")?.trim()}
            onClick={handleSubmit(onSubmit)}
          >
            Submit Review
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};
