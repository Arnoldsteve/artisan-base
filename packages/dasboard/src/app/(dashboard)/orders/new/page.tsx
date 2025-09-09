import { PageHeader } from "@/components/shared/page-header";
import { NewOrderForm } from "../components/NewOrderForm";

export default function NewOrderPage() {
  return (
    <div className="p-4 md:p-8 lg:p-10">
      <PageHeader
        title="Create New Order"
        description="Manually create a new order for a customer."
      />
      
      <div className="mt-8">
        <NewOrderForm />
      </div>
    </div>
  );
}