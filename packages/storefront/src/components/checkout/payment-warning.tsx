import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const PaymentWarning = () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <AlertTitle>Payment Gateway Not Activated</AlertTitle>
        <AlertDescription>
          The payment system is currently in test mode. No real charges will be
          made to your account.
        </AlertDescription>
      </div>
    </Alert>
  );
};
