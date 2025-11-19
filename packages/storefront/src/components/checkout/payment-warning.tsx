import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const PaymentWarning= () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <AlertTitle>Payment Gateway Not Activated</AlertTitle>
        <AlertDescription>
          Your account will not be charged during this process.
        </AlertDescription>
      </div>
    </Alert>
  );
}
