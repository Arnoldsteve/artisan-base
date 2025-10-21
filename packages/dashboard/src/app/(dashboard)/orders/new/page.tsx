import { PageHeader } from "@/components/shared/page-header";
import { NewOrderForm } from "../components/new-order-form";

export default function NewOrderPage() {
  return (
    <>
      <PageHeader title="Create New Order" />
      <div className="p-4 md:p-8 lg:p-10">
        <NewOrderForm />
      </div>
    </>
  );
}
