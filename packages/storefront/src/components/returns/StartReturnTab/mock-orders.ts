export const mockOrders = [
  {
    id: "ORD-12345",
    date: "2024-06-01",
    total: 120.97,
    itemsCount: 3,
    items: [
      {
        id: "item-1",
        name: "Classic Blue Denim Jacket",
        variant: "M",
        image: "/mock/product1.jpg",
        price: 59.99,
        eligible: true,
      },
      {
        id: "item-2",
        name: "White Cotton T-Shirt",
        variant: "L",
        image: "/mock/product2.jpg",
        price: 19.99,
        eligible: false,
      },
      {
        id: "item-3",
        name: "Black Running Shoes",
        variant: "42",
        image: "/mock/product3.jpg",
        price: 40.99,
        eligible: true,
      },
    ],
  },
  {
    id: "ORD-12346",
    date: "2024-05-15",
    total: 49.99,
    itemsCount: 1,
    items: [
      {
        id: "item-4",
        name: "Red Hoodie",
        variant: "S",
        image: "/mock/product4.jpg",
        price: 49.99,
        eligible: true,
      },
    ],
  },
];
