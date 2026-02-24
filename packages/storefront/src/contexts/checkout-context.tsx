"use client";

import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { 
  Customer, 
  ShippingAddress, 
  ShippingOption, 
  PaymentMethod,
  CheckoutPayload 
} from "@/types/checkout";
import { toast } from "sonner";

type State = {
  currentStep: number;
  customer: Customer | null;
  shippingAddress: ShippingAddress | null;
  selectedShippingOption: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
  order: any | null;
  isHydrated: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_CUSTOMER"; payload: Customer }
  | { type: "SET_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SET_SHIPPING_OPTION"; payload: ShippingOption }
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "SET_ORDER"; payload: any }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "HYDRATE"; payload: Partial<State> }
  | { type: "RESET" };

const initialState: State = {
  currentStep: 0,
  customer: null,
  shippingAddress: null,
  selectedShippingOption: null,
  selectedPaymentMethod: null,
  order: null,
  isHydrated: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE": return { ...state, ...action.payload, isHydrated: true };
    case "SET_CUSTOMER": return { ...state, customer: action.payload };
    case "SET_SHIPPING_ADDRESS": return { ...state, shippingAddress: action.payload };
    case "SET_SHIPPING_OPTION": return { ...state, selectedShippingOption: action.payload };
    case "SET_PAYMENT_METHOD": return { ...state, selectedPaymentMethod: action.payload };
    case "NEXT_STEP": return { ...state, currentStep: state.currentStep + 1 };
    case "PREVIOUS_STEP": return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "GO_TO_STEP": return { ...state, currentStep: action.payload };
    case "SET_ORDER": return { ...state, order: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "RESET": return { ...initialState, isHydrated: true };
    default: return state;
  }
}

const CheckoutContext = createContext<any>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, clearCart } = useCart();
  const { createOrder, isCreating } = useOrders();

  useEffect(() => {
    const stored = localStorage.getItem("checkout_v2");
    if (stored) {
      try { dispatch({ type: "HYDRATE", payload: JSON.parse(stored) }); }
      catch (e) { dispatch({ type: "HYDRATE", payload: {} }); }
    } else { dispatch({ type: "HYDRATE", payload: {} }); }
  }, []);

  useEffect(() => {
    if (state.isHydrated) localStorage.setItem("checkout_v2", JSON.stringify(state));
  }, [state]);

  /**
   * TOP 1% LOGIC: Secure Multi-Vendor Submission
   * millions of users: Handles redirects for PayPal/Stripe and internal 
   * navigation for M-Pesa in one unified flow.
   */
  const submitOrder = async () => {
    if (!state.customer || !state.shippingAddress || !state.selectedPaymentMethod) {
      dispatch({ type: "SET_ERROR", payload: "Please complete all steps." });
      return;
    }

    // 1. DATA SCRUBBING: Map Cart Items to Product IDs only
    const vendorGroups = items.reduce((acc, item) => {
      if (!acc[item.tenantId]) acc[item.tenantId] = [];
      acc[item.tenantId].push({ productId: item.id, quantity: item.quantity });
      return acc;
    }, {} as Record<string, { productId: string; quantity: number }[]>);

    // 2. PAYLOAD CONSTRUCTION: Normalize keys for Backend DTO
    const payload: CheckoutPayload = {
      customer: state.customer,
      shippingAddress: {
        addressLine1: state.shippingAddress.addressLine1,
        addressLine2: state.shippingAddress.addressLine2,
        city: state.shippingAddress.city,
        state: state.shippingAddress.state,
        postalCode: state.shippingAddress.postalCode,
        country: state.shippingAddress.country,
      },
      paymentProvider: (state.selectedPaymentMethod.provider || "CASH").toUpperCase() as any,
      currency: "KES",
      vendors: Object.entries(vendorGroups).map(([tenantId, mappedItems]) => ({
        tenantId,
        items: mappedItems,
        shippingMethodId: state.selectedShippingOption?.id || "standard",
      })),
    };

    // console.log("Submitting Checkout Payload:", payload); // ✅ DEBUG LOG
    // return
    try {
      // 3. EXECUTE CHECKOUT
      const response = await createOrder(payload);
      
      // Save order info for the confirmation page
      dispatch({ type: "SET_ORDER", payload: response });

      // Clear cart items (the order is now in the DB)
      clearCart();
      
      /**
       * 4. DYNAMIC REDIRECT (Stripe/PayPal)
       * If the backend returns a checkoutUrl, we must leave the site.
       */
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        // Internal flow (M-Pesa / Cash)
        router.push("/checkout/confirmation");
      }
    } catch (e: any) {
      const msg = e.message || "Failed to process checkout.";
      dispatch({ type: "SET_ERROR", payload: msg });
      toast.error(msg);
    }
  };

  const resetCheckout = () => {
    localStorage.removeItem("checkout_v2");
    dispatch({ type: "RESET" });
  };

  const value = useMemo(() => ({
    ...state,
    isLoading: isCreating,
    setCustomer: (c: Customer) => dispatch({ type: "SET_CUSTOMER", payload: c }),
    setShippingAddress: (a: ShippingAddress) => dispatch({ type: "SET_SHIPPING_ADDRESS", payload: a }),
    setShippingOption: (o: ShippingOption) => dispatch({ type: "SET_SHIPPING_OPTION", payload: o }),
    setPaymentMethod: (m: PaymentMethod) => dispatch({ type: "SET_PAYMENT_METHOD", payload: m }),
    nextStep: () => dispatch({ type: "NEXT_STEP" }),
    previousStep: () => dispatch({ type: "PREVIOUS_STEP" }),
    goToStep: (s: number) => dispatch({ type: "GO_TO_STEP", payload: s }),
    submitOrder,
    resetCheckout,
  }), [state, isCreating, items]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export const useCheckoutContext = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckoutContext must be used within a CheckoutProvider");
  return ctx;
};