"use client";

import { useState } from "react";
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
import StarRating from "./star-rating";

interface CustomerReviewSectionProps {
  product: {
    id: string;
    name: string;
    rating?: number;
    reviewCount?: number;
  };
}

export function CustomerReviewSection({ product }: CustomerReviewSectionProps) {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    console.log("Submitted review:", { userRating, reviewText });
    // later -> send to API
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

      <div className="flex items-center space-x-3 mb-6">
        <StarRating rating={product.rating || 0} />
        <span className="text-sm text-muted-foreground">
          {product.rating ? product.rating.toFixed(1)  : "No ratings yet"}
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
          <CardTitle className="text-lg font-medium">
            Write a Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Your Rating</Label>
              <div className="mt-2">
                <StarRating 
                  rating={userRating}
                  editable
                  onChange={setUserRating}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your thoughts about this product..."
                className="mt-2"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!userRating || !reviewText.trim()}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
