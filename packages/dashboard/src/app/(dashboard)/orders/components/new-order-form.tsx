"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/products";
import {
  CreateOrderDto,
  CustomerDetailsDto,
  AddressDto,
  ManualOrderItemDto,
} from "@/types/orders";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@repo/ui";
import { toast } from "sonner";
import { Loader2, X, PlusCircle, MinusCircle } from "lucide-react";
import { productService } from "@/services/product-service";
import { orderService } from "@/services/order-service";
import { formatMoney } from "@/utils/money";
import { TAX_RATE } from "@/constants/tax";
import { FREE_SHIPPING_THRESHOLD } from "@/constants/shipping";
import { shippingOptions } from "@/utils/shupping-options";

/**
 * OrderItemState combines Product info with quantity for local state.
 */
type OrderItemState = Product & { quantity: number };

/**
 * Subcomponent for managing order items input.
 */
function OrderItemsInput({
  items,
  setItems,
}: {
  items: OrderItemState[];
  setItems: React.Dispatch<React.SetStateAction<OrderItemState[]>>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    productService
      .searchProducts(debouncedSearchTerm)
      .then(setSearchResults)
      .catch(() => toast.error("Failed to search for products."))
      .finally(() => setIsSearching(false));
  }, [debouncedSearchTerm]);

  const handleAddItem = useCallback(
    (product: Product) => {
      if (product.inventoryQuantity <= 0) {
        toast.error(`Product '${product.name}' is out of stock.`);
        return;
      }
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.id === product.id
        );
        if (existingItem) {
          return currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...currentItems, { ...product, quantity: 1 }];
      });
      setSearchTerm("");
      setSearchResults([]);
    },
    [setItems]
  );

  const handleQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
      );
    },
    [setItems]
  );

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-2">
          <Label htmlFor="product-search">Add Product</Label>
          <Input
            id="product-search"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin text-muted-foreground" />
          )}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
              <ul>
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleAddItem(product)}
                      className="w-full text-left px-4 py-2 hover:bg-muted"
                    >
                      {product.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No items added to the order.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="flex-1 font-medium">{item.name}</div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-24 text-right">
                  {formatMoney(Number(item.price) * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Subcomponent for order summary and submission.
 */

function OrderSummary({
  totalAmount,
  formError,
  isSubmitting,
  shippingAmount = 0,
}: {
  totalAmount: number;
  formError: string | null;
  isSubmitting: boolean;
  shippingAmount?: number;
}) {
  const taxAmount = totalAmount * TAX_RATE;
  const effectiveShipping =
    totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : shippingAmount;
  const finalTotal = totalAmount + taxAmount + effectiveShipping;

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-lg">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(totalAmount)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Tax (16%)</span>
            <span>{formatMoney(taxAmount)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>
              {effectiveShipping === 0
                ? "FREE"
                : formatMoney(effectiveShipping)}
            </span>
          </div>

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>{formatMoney(finalTotal)}</span>
          </div>
        </div>

        {formError && (
          <p className="text-sm text-destructive mt-4">{formError}</p>
        )}

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Order
        </Button>
      </CardContent>
    </Card>
  );
}

function AddressForm({
  address,
  setAddress,
  prefix,
}: {
  address: AddressDto;
  setAddress: (a: AddressDto) => void;
  prefix: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${prefix}-firstName`}>First Name</Label>
          <Input
            id={`${prefix}-firstName`}
            value={address.firstName}
            onChange={(e) =>
              setAddress({ ...address, firstName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-lastName`}>Last Name</Label>
          <Input
            id={`${prefix}-lastName`}
            value={address.lastName}
            onChange={(e) =>
              setAddress({ ...address, lastName: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`${prefix}-addressLine1`}>Address Line 1</Label>
        <Input
          id={`${prefix}-addressLine1`}
          value={address.addressLine1}
          onChange={(e) =>
            setAddress({ ...address, addressLine1: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor={`${prefix}-addressLine2`}>Address Line 2</Label>
        <Input
          id={`${prefix}-addressLine2`}
          value={address.addressLine2}
          onChange={(e) =>
            setAddress({ ...address, addressLine2: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${prefix}-city`}>City</Label>
          <Input
            id={`${prefix}-city`}
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-state`}>State</Label>
          <Input
            id={`${prefix}-state`}
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${prefix}-postalCode`}>Postal Code</Label>
          <Input
            id={`${prefix}-postalCode`}
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-country`}>Country</Label>
          <Input
            id={`${prefix}-country`}
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
            required
          />
        </div>
      </div>
    </div>
  );
}

function CustomerForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhoneNumber,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhoneNumber: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <div>
        <Label htmlFor="customer-email">Email</Label>
        <Input
          id="customer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="customer-firstName">First Name</Label>
          <Input
            id="customer-firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="customer-lastName">Last Name</Label>
          <Input
            id="customer-lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="customer-lastName">Phone Number</Label>
        <Input
          id="customer-phone"
          value={phone}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

/**
 * Main NewOrderForm component, orchestrating subcomponents and business logic.
 */
export function NewOrderForm() {
  const router = useRouter();
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState<AddressDto>({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<AddressDto>({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [items, setItems] = useState<OrderItemState[]>([]);
  const [shippingAmount, setShippingAmount] = useState<number | undefined>(
    undefined
  );
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const totalAmount = useMemo(() => {
    return items.reduce(
      (total, item) => Number(total) + Number(item.price) * item.quantity,
      0
    );
  }, [items]);

  // Automatically default to "standard" shipping when items are added
  useEffect(() => {
    const standardOption = shippingOptions.find((opt) => opt.id === "standard");
    if (!standardOption) return;

    if (
      totalAmount > 0 &&
      (shippingAmount === undefined || shippingAmount === 0)
    ) {
      setShippingAmount(standardOption.price);
    }
  }, [totalAmount, shippingAmount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (items.length === 0) {
      setFormError("Please add at least one product to the order.");
      toast.error("Please add at least one product to the order.");
      return;
    }
    setIsSubmitting(true);
    const orderData: CreateOrderDto = {
      customer: {
        email: customerEmail,
        firstName: customerFirstName,
        lastName: customerLastName,
        phoneNumber: customerPhoneNumber,
      },
      shippingAddress: { ...shippingAddress },
      billingAddress: billingSameAsShipping
        ? { ...shippingAddress }
        : { ...billingAddress },
      items: items.map((item) => ({
        productId: item.id,
        variantId: (item as any).variantId,
        quantity: item.quantity,
      })),
      shippingAmount,
      currency: "KES",
      notes,
    };
    console.log("Order Data:", orderData);
    try {
      const newOrder = await orderService.createOrder(orderData);
      toast.success(`Order #${newOrder.orderNumber} created successfully!`);
      router.push(`/dashboard/orders/${newOrder.id}`);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <OrderItemsInput items={items} setItems={setItems} />
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm
              address={shippingAddress}
              setAddress={setShippingAddress}
              prefix="shipping"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                />
                Billing address same as shipping
              </label>
            </div>
            {!billingSameAsShipping && (
              <AddressForm
                address={billingAddress}
                setAddress={setBillingAddress}
                prefix="billing"
              />
            )}
          </CardContent>
        </Card>
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shippingOptions.map((option) => {
              const isFree =
                totalAmount >= FREE_SHIPPING_THRESHOLD &&
                option.id === "standard";
              const cost = isFree ? 0 : option.price;
              const isSelected = shippingAmount === cost;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setShippingAmount(cost)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200
            ${
              isSelected
                ? "border-primary bg-accent/30"
                : "border-muted hover:border-primary/40"
            }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description} • {option.estimatedDays}
                      </p>
                      {option.cutoff && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {option.cutoff}
                        </p>
                      )}
                    </div>
                    <div className="text-right font-medium">
                      {isFree ? "FREE" : formatMoney(option.price)}
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm
              firstName={customerFirstName}
              setFirstName={setCustomerFirstName}
              lastName={customerLastName}
              setLastName={setCustomerLastName}
              email={customerEmail}
              setEmail={setCustomerEmail}
              phone={customerPhoneNumber}
              setPhoneNumber={setCustomerPhoneNumber}
            />
          </CardContent>
        </Card>

        <div>
          <Label htmlFor="order-notes">Notes</Label>
          <Textarea
            className="bg-white"
            id="order-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <OrderSummary
          totalAmount={totalAmount}
          shippingAmount={shippingAmount ?? 0}
          formError={formError}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}
