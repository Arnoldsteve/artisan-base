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

type State = {
  currentStep: number;
  customer: Customer | null;
  shippingAddress: ShippingAddress | null;
  selectedShippingOption: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
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
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "HYDRATE"; payload: Partial<State> }
  | { type: "RESET" };

const initialState: State = {
  currentStep: 0,
  customer: null,
  shippingAddress: null,
  selectedShippingOption: null,
  selectedPaymentMethod: null,
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
    case "SET_ERROR": return { ...state, error: action.payload };
    case "RESET": return { ...initialState, isHydrated: true };
    default: return state;
  }
}

const CheckoutContext = createContext<any>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, clearCart, getTotalPrice } = useCart();
  const { createOrder, isCreating } = useOrders();

  // 1. Safe Hydration (Prevents Next.js 15 Mismatch)
  useEffect(() => {
    const stored = localStorage.getItem("checkout_v1");
    if (stored) {
      try {
        dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
      } catch (e) {
        dispatch({ type: "HYDRATE", payload: {} });
      }
    } else {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  // 2. Persistence
  useEffect(() => {
    if (state.isHydrated) {
      localStorage.setItem("checkout_v1", JSON.stringify(state));
    }
  }, [state]);

  /**
   * TOP 1% LOGIC: Multi-Vendor Payload Construction
   * Group items by tenantId so each merchant gets their own order record.
   */
  const submitOrder = async () => {
    if (!state.customer || !state.shippingAddress || !state.selectedPaymentMethod) {
      dispatch({ type: "SET_ERROR", payload: "Please complete all steps." });
      return;
    }

    // A. Partition cart items by vendor (tenantId)
    const vendorGroups = items.reduce((acc, item) => {
      if (!acc[item.tenantId]) acc[item.tenantId] = [];
      acc[item.tenantId].push(item);
      return acc;
    }, {} as Record<string, typeof items>);

    // B. Construct Enterprise Payload
    const payload: CheckoutPayload = {
      customer: state.customer,
      shippingAddress: state.shippingAddress,
      billingAddress: state.shippingAddress, // Standard: Default billing to shipping
      paymentMethod: state.selectedPaymentMethod.provider,
      currency: "KES", // This would be dynamic based on the context
      vendors: Object.entries(vendorGroups).map(([tenantId, vendorItems]) => ({
        tenantId,
        items: vendorItems,
        shippingMethodId: state.selectedShippingOption?.id || "standard",
      })),
    };

    try {
      const response = await createOrder(payload);
      
      // C. Success Cleanup
      localStorage.removeItem("checkout_v1");
      clearCart();
      
      // D. Intelligent Redirect
      // If Stripe/PayPal, go to checkoutUrl. If M-Pesa/Cash, go to confirmation.
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        router.push("/checkout/confirmation");
      }
    } catch (e: any) {
      dispatch({ type: "SET_ERROR", payload: e.message || "Checkout failed" });
    }
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
  }), [state, isCreating, items]);

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckoutContext must be used within CheckoutProvider");
  return ctx;
};