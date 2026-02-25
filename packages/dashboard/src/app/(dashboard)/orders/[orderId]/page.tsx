import { OrderDetailsView } from "./components/order-details-view";


interface PageProps {
  params: Promise<{ orderId: string }>;
}

/**
 * SOLID Principle: Interface Segregation
 * This page serves as the routing entry point, delegating all 
 * data-fetching and UI logic to the OrderDetailsView.
 */
export default async function OrderPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="flex-1">
      <OrderDetailsView orderId={orderId} />
    </div>
  );
}