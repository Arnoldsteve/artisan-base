"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import {
  Customer,
  ShippingAddress,
  ShippingOption,
  PaymentMethod,
  CheckoutPayload,
} from "@/types/checkout";
import { toast } from "sonner";

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
    case "HYDRATE":
      return { ...state, ...action.payload, isHydrated: true };
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload };
    case "SET_SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.payload };
    case "SET_SHIPPING_OPTION":
      return { ...state, selectedShippingOption: action.payload };
    case "SET_PAYMENT_METHOD":
      return { ...state, selectedPaymentMethod: action.payload };
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREVIOUS_STEP":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return { ...initialState, isHydrated: true };
    default:
      return state;
  }
}

const CheckoutContext = createContext<any>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
   * TOP 1% LOGIC: Secure Payload Mapping
   * Clears "property should not exist" and "state is empty" errors.
   */
  const submitOrder = async () => {
    if (!state.customer || !state.shippingAddress || !state.selectedPaymentMethod) {
      dispatch({ type: "SET_ERROR", payload: "Please complete all checkout steps." });
      return;
    }

    // 1. DATA SCRUBBING: Group items and strip names/prices (Anti-Fraud)
    const vendorGroups = items.reduce((acc, item) => {
      if (!acc[item.tenantId]) acc[item.tenantId] = [];
      
      acc[item.tenantId].push({
        productId: item.id, // Maps 'id' to 'productId'
        quantity: item.quantity,
      });
      return acc;
    }, {} as Record<string, { productId: string; quantity: number }[]>);

    // 2. CONSTRUCT PAYLOAD: Explicitly selecting ONLY allowed fields
    const payload: CheckoutPayload = {
      customer: {
        firstName: state.customer.firstName,
        lastName: state.customer.lastName,
        email: state.customer.email,
        phone: state.customer.phone,
      },
      shippingAddress: {
        addressLine1: state.shippingAddress.addressLine1,
        addressLine2: state.shippingAddress.addressLine2,
        city: state.shippingAddress.city,
        state: state.shippingAddress.state, 
        postalCode: state.shippingAddress.postalCode,
        country: state.shippingAddress.country,
      },
      paymentProvider: (state.selectedPaymentMethod?.provider || "CASH").toUpperCase() as any, 
      currency: "KES",
      vendors: Object.entries(vendorGroups).map(([tenantId, mappedItems]) => ({
        tenantId,
        items: mappedItems,
        shippingMethodId: state.selectedShippingOption?.id || "standard",
      })),
    };

    // console.log("Submitting checkout payload:", payload); // Debug log to verify structure
    // return

    try {
      // 3. SECURE SUBMISSION
      const response = await createOrder(payload);
      
      localStorage.removeItem("checkout_v1");
      clearCart();
      
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        router.push("/checkout/confirmation");
      }
    } catch (e: any) {
      const errorMessage = e.message || "Checkout failed. Please try again.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      isLoading: isCreating,
      setCustomer: (c: Customer) =>
        dispatch({ type: "SET_CUSTOMER", payload: c }),
      setShippingAddress: (a: ShippingAddress) =>
        dispatch({ type: "SET_SHIPPING_ADDRESS", payload: a }),
      setShippingOption: (o: ShippingOption) =>
        dispatch({ type: "SET_SHIPPING_OPTION", payload: o }),
      setPaymentMethod: (m: PaymentMethod) =>
        dispatch({ type: "SET_PAYMENT_METHOD", payload: m }),
      nextStep: () => dispatch({ type: "NEXT_STEP" }),
      previousStep: () => dispatch({ type: "PREVIOUS_STEP" }),
      goToStep: (s: number) => dispatch({ type: "GO_TO_STEP", payload: s }),
      submitOrder,
    }),
    [state, isCreating, items],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx)
    throw new Error("useCheckoutContext must be used within CheckoutProvider");
  return ctx;
};
