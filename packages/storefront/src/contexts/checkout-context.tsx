import React, { createContext, useContext, useReducer, useEffect } from "react";
import type {
  CheckoutContextType,
  Customer,
  ShippingAddress,
  ShippingOption,
  PaymentMethod,
  Order,
} from "@/types/checkout";
import type { CartItem } from "@/types/cart";
import { apiClient } from "@/lib/api-client";
import { useCart } from "@/hooks/use-cart";
import { paymentMethods } from "@/utils/payment-methods";
import { useRouter } from "next/navigation";

type State = {
  currentStep: number;
  customer: Customer | null;
  shippingAddress: ShippingAddress | null;
  selectedShippingOption: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
  order: Order | null;
  isLoading: boolean;
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
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDER"; payload: Order }
  | { type: "RESET" };

const initialState: State = {
  currentStep: 0,
  customer: null,
  shippingAddress: null,
  selectedShippingOption: null,
  selectedPaymentMethod: null,
  order: null,
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
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
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload };
    case "RESET":
      return { ...initialState, customer: state.customer,
      };
    default:
      return state;
  }
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("checkout");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...init,
          ...parsed,
          selectedPaymentMethod: parsed.selectedPaymentMethod
            ? paymentMethods.find(
                (m) => m.id === parsed.selectedPaymentMethod.id
              ) || null
            : null,
        };
      }
    }
    return init;
  });

  useEffect(() => {
    localStorage.setItem("checkout", JSON.stringify(state));
  }, [state]);

  const { items, clearCart } = useCart();

  // Actions
  const setCustomer = (customer: Customer) =>
    dispatch({ type: "SET_CUSTOMER", payload: customer });

  const setShippingAddress = (address: ShippingAddress) =>
    dispatch({ type: "SET_SHIPPING_ADDRESS", payload: address });

  const setShippingOption = (option: ShippingOption) =>
    dispatch({ type: "SET_SHIPPING_OPTION", payload: option });

  const setPaymentMethod = (method: PaymentMethod) =>
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method });

  const nextStep = () => dispatch({ type: "NEXT_STEP" });

  const previousStep = () => dispatch({ type: "PREVIOUS_STEP" });

  const goToStep = (step: number) =>
    dispatch({ type: "GO_TO_STEP", payload: step });

  const setLoading = (loading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: loading });

  const setError = (error: string | null) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const setOrder = (order: Order) =>
    dispatch({ type: "SET_ORDER", payload: order });

  const resetCheckout = () => dispatch({ type: "RESET" });

  const submitOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare order payload
      const payload = {
        customer: state.customer,
        shippingAddress: state.shippingAddress,
        billingAddress: state.shippingAddress,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        // shippingOption: state.selectedShippingOption?.id,
        // paymentMethod: state.selectedPaymentMethod?.id,
        currency: "KES",
        notes: undefined,
        // shippingAmount: state.selectedShippingOption?.price || 0,
      };
      // Call backend API
      const response = await apiClient.post<any>(
        "/api/v1/storefront/orders",
        payload
      );
      console.log("Order response from order checkout:", response);
      setOrder({
        id: response.order.id,
        customer: state.customer!,
        shippingAddress: state.shippingAddress!,
        shippingOption: state.selectedShippingOption!,
        paymentMethod: state.selectedPaymentMethod!,
        items,
        subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        shippingCost: state.selectedShippingOption?.price || 0,
        tax: 0,
        total:
          items.reduce((sum, i) => sum + i.price * i.quantity, 0) +
          (state.selectedShippingOption?.price || 0),
        status: "pending",
        createdAt: new Date(response.order.createdAt),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      clearCart();
      nextStep();
      router.push("/checkout/confirmation");
    } catch (e: any) {
      setError(e.message || "Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        setCustomer,
        setShippingAddress,
        setShippingOption,
        setPaymentMethod,
        nextStep,
        previousStep,
        goToStep,
        submitOrder,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export function useCheckoutContext() {
  const ctx = useContext(CheckoutContext);
  if (!ctx)
    throw new Error("useCheckoutContext must be used within CheckoutProvider");
  return ctx;
}
