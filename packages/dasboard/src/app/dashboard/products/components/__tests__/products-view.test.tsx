import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductsView } from "../products-view";
import { productService } from "@/services/product-service";

jest.mock("@/services/product-service");

describe("ProductsView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product list", async () => {
    (productService.searchProducts as jest.Mock).mockResolvedValue([
      { id: "prod1", name: "Product 1", price: 10, inventoryQuantity: 10 },
      { id: "prod2", name: "Product 2", price: 20, inventoryQuantity: 5 },
    ]);
    render(<ProductsView initialProducts={[]} />);
    fireEvent.change(screen.getByPlaceholderText("Filter by name..."), {
      target: { value: "Product" },
    });
    await waitFor(() =>
      expect(screen.getByTestId("product-name-prod1")).toBeInTheDocument()
    );
    expect(screen.getByTestId("product-name-prod2")).toBeInTheDocument();
  });

  it("handles product search", async () => {
    (productService.searchProducts as jest.Mock).mockResolvedValue([
      { id: "prod1", name: "Product 1", price: 10, inventoryQuantity: 10 },
    ]);
    render(<ProductsView initialProducts={[]} />);
    fireEvent.change(screen.getByPlaceholderText("Filter by name..."), {
      target: { value: "Product 1" },
    });
    await waitFor(() =>
      expect(screen.getByTestId("product-name-prod1")).toBeInTheDocument()
    );
  });

  it("handles product search error", async () => {
    (productService.searchProducts as jest.Mock).mockRejectedValue(
      new Error("fail")
    );
    render(<ProductsView initialProducts={[]} />);
    fireEvent.change(screen.getByPlaceholderText("Filter by name..."), {
      target: { value: "fail" },
    });
    await waitFor(() =>
      expect(screen.getByTestId("products-empty-state")).toBeInTheDocument()
    );
  });

  // Add more tests for create, update, delete, error handling as needed
});
