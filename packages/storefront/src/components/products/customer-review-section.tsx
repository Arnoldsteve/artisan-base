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
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/date";

interface CustomerReviewSectionProps {
  productId: string;
}

export const CustomerReviewSection: React.FC<CustomerReviewSectionProps> = ({
  productId,
}) => {
  const { user, isAuthenticated } = useAuthContext();
  const createReviewMutation = useCreateReview();
  const { data: productReviews, isLoading } = useProductReviews(productId);

  console.log("productReviews", productReviews)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: productId,
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
          reset({
            productId: productId,
            rating: 0,
            comment: "",
          });
          toast.success("Review submitted successfully!");
        },
      }
    );
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="flex items-center space-x-3 mb-6">
        <StarRating rating={productReviews?.averageRating || 0} />
        <span className="text-sm text-muted-foreground">
          {productReviews?.averageRating
            ? productReviews.averageRating.toFixed(1)
            : "No ratings yet"}
          {productReviews?.reviewCount
            ? ` (${productReviews.reviewCount} ${
                productReviews.reviewCount === 1 ? "review" : "reviews"
              })`
            : ""}
        </span>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <Card className="mb-8 shadow-none">
          <CardContent className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          </CardContent>
        </Card>
      ) : productReviews && productReviews.reviews && productReviews.reviews.length > 0 ? (
        <div className="space-y-4 mb-8">
          {productReviews.reviews.map((review) => (
            <Card key={review.id} className="shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <strong className="text-base">
                      {review.customer?.firstName || "Anonymous"}{" "}
                      {review.customer?.lastName || ""}
                    </strong>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-8 shadow-none">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to leave one!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Write a Review Form */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about this product..."
                className="mt-2 min-h-[100px]"
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.comment.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={
              !rating ||
              !watch("comment")?.trim() ||
              createReviewMutation.isPending
            }
            onClick={handleSubmit(onSubmit)}
          >
            {createReviewMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </CardFooter>
      </Card>

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Please log in to submit a review
        </p>
      )}
    </section>
  );
};