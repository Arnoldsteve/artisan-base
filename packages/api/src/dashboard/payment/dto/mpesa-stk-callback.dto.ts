// This DTO represents the complex nested structure of the M-Pesa STK callback.
// We are only defining the fields we care about for now.

class StkCallbackMetadataItem {
  Name: string;
  Value: string | number;
}

class StkCallbackBody {
  stkCallback: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: number;
    ResultDesc: string;
    CallbackMetadata?: {
      Item: StkCallbackMetadataItem[];
    };
  };
}

export class MpesaStkCallbackDto {
  Body: StkCallbackBody;
}