"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { reviewSchema, ReviewSchema } from "@/validation-schemas/review-schema";
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
import { toast } from "sonner";
import { useCreateReview, useProductReviews } from "@/hooks/use-review";

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
  const createReviewMutation = useCreateReview();
  const { data: reviews, isLoading } = useProductReviews(product.id);

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
      comment: "",
    },
  });

  const rating = watch("rating");

  const onSubmit = (data: ReviewSchema) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    createReviewMutation.mutate(
      {
        ...data,
        customerId: user.id,
      },
      {
        onSuccess: () => {
          setValue("rating", 0);
          setValue("comment", "");
        },
      }
    );
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

      {/* Display reviews if they exist */}
      {isLoading ? (
        <Card className="mb-8 shadow-none">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Loading reviews...
          </CardContent>
        </Card>
      ) : reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.id} className="mb-4 shadow-none">
            <CardContent>
              <div className="flex items-center justify-between">
                <strong>{review.user?.firstName || "Anonymous"}</strong>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="mb-8 shadow-none">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first to leave one!
          </CardContent>
        </Card>
      )}

      {/* Write a review */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <Label>Your Review</Label>
              <Textarea
                placeholder="Share your thoughts about this product..."
                className="mt-2"
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!rating || !watch("comment")?.trim() || createReviewMutation.isMutating}
            onClick={handleSubmit(onSubmit)}
          >
            {createReviewMutation.isMutating ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};
