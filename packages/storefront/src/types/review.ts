export interface CreateReviewDto {
  productId: string;  // the product being reviewed
  rating: number;     // user rating, e.g., 1-5
  comment: string; // the text content of the review
  userId?: string;    // optional if user is logged in
}
