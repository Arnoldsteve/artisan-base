import { ReviewsWrapper } from "./components/reviews-wrapper";

/**
 * SOLID Principle: Interface Segregation
 * The page serves as a simple entry point, delegating all 
 * client-side state and logic to the ReviewsWrapper.
 */
export default function ReviewsPage() {
  return <ReviewsWrapper />;
}