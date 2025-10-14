export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment: string;
  userId?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
export interface ProductReviewsResponse {
  productId: string;
  slug: string;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
}