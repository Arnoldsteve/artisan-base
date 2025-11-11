import { PageHeader } from "@/components/shared/page-header";
import { NewOrderForm } from "../components/new-order-form";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

export default function NewOrderPage() {
  return (
    <>
      <PageHeader title="Create New Order">
        <Link href="/orders">
          <Button> Order List</Button>
        </Link>
      </PageHeader>
      <div className="px-4 md:px-4 lg:px-8 md:mt-0 md:pb-10">
        <NewOrderForm />
      </div>
    </>
  );
}
