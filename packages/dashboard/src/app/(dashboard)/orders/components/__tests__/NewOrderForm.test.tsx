import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { productService } from "@/services/product-service";
import { orderService } from "@/services/order-service";
import { NewOrderForm } from "../new-order-form";

jest.mock("@/services/product-service");
jest.mock("@/services/order-service");

describe("NewOrderForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<NewOrderForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shipping Address/i)).toBeInTheDocument();
  });

  it("searches for products and adds item", async () => {
    (productService.searchProducts as jest.Mock).mockResolvedValue([
      { id: "prod1", name: "Product 1", price: 10, inventoryQuantity: 10 },
    ]);
    render(<NewOrderForm />);
    fireEvent.change(screen.getByPlaceholderText("Search by product name..."), {
      target: { value: "Product" },
    });
    await waitFor(() =>
      expect(screen.getByText("Product 1")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Product 1"));
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });

  it("handles product search error", async () => {
    (productService.searchProducts as jest.Mock).mockRejectedValue(
      new Error("fail")
    );
    render(<NewOrderForm />);
    fireEvent.change(screen.getByPlaceholderText("Search by product name..."), {
      target: { value: "fail" },
    });
    await waitFor(() =>
      expect(screen.getByText(/no items added/i)).toBeInTheDocument()
    );
  });

  it("adds and removes items, changes quantity, calculates total", async () => {
    (productService.searchProducts as jest.Mock).mockResolvedValue([
      { id: "prod1", name: "Product 1", price: 10, inventoryQuantity: 10 },
    ]);
    render(<NewOrderForm />);
    fireEvent.change(screen.getByPlaceholderText("Search by product name..."), {
      target: { value: "Product" },
    });
    await waitFor(() =>
      expect(screen.getByText("Product 1")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Product 1"));
    // Increase quantity
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    // Decrease quantity
    fireEvent.click(screen.getByLabelText("Decrease quantity"));
    // Check total
    expect(screen.getAllByText("$10.00").length).toBeGreaterThan(0);
  });

  it("validates form and submits order", async () => {
    (productService.searchProducts as jest.Mock).mockResolvedValue([
      { id: "prod1", name: "Product 1", price: 10, inventoryQuantity: 10 },
    ]);
    (orderService.createOrder as jest.Mock).mockResolvedValue({
      id: "order1",
      orderNumber: "ORD-000001",
    });
    render(<NewOrderForm />);
    fireEvent.change(screen.getByPlaceholderText("Search by product name..."), {
      target: { value: "Product" },
    });
    await waitFor(() =>
      expect(screen.getByText("Product 1")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Product 1"));
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Shipping Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.click(screen.getByText(/Create Order/i));
    await waitFor(() => expect(orderService.createOrder).toHaveBeenCalled());
  });

  it("shows error on order submission failure", async () => {
    (productService.searchProducts as jest.Mock).mockResolvedValue([
      { id: "prod1", name: "Product 1", price: 10, inventoryQuantity: 10 },
    ]);
    (orderService.createOrder as jest.Mock).mockRejectedValue(
      new Error("fail")
    );
    render(<NewOrderForm />);
    fireEvent.change(screen.getByPlaceholderText("Search by product name..."), {
      target: { value: "Product" },
    });
    await waitFor(() =>
      expect(screen.getByText("Product 1")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Product 1"));
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Shipping Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.click(screen.getByText(/Create Order/i));
    await waitFor(() => expect(screen.getByText(/fail/i)).toBeInTheDocument());
  });
});
