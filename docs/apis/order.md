# Order API Documentation

## Overview

The Order API provides endpoints for creating, retrieving, and updating orders in a multi-tenant, high-performance e-commerce system. It is architected for scalability, maintainability, and efficiency, following SOLID, DRY, and Separation of Concerns principles.

---

## Endpoints

### Create Manual Order

- **POST** `/dashboard/orders`
- **Description:** Create a new order with customer, items, and addresses. Handles stock decrement and customer upsert atomically.
- **Request Body:**

```json
{
  "customer": { "email": "string", "firstName": "string", "lastName": "string" },
  "items": [
    { "productId": "string", "variantId": "string", "quantity": 1 }
  ],
  "shippingAddress": { ... },
  "billingAddress": { ... },
  "notes": "string",
  "shippingAmount": 0
}
```

- **Response:**

```json
{
  "id": "string",
  "orderNumber": "ORD-000001",
  "customer": { ... },
  "items": [ ... ],
  "subtotal": 100.00,
  "totalAmount": 110.00,
  ...
}
```

- **Errors:**
  - 400: Not enough stock, invalid variant, etc.
  - 404: Product or variant not found

---

### Get All Orders

- **GET** `/dashboard/orders?page=1&limit=20`
- **Description:** Paginated list of orders, sorted by most recent.
- **Response:**

```json
{
  "data": [ { "id": "string", ... } ],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

---

### Get Order by ID

- **GET** `/dashboard/orders/:id`
- **Description:** Retrieve a single order with all line items.
- **Response:**

```json
{
  "id": "string",
  "orderNumber": "ORD-000001",
  "items": [ ... ],
  ...
}
```

- **Errors:**
  - 404: Order not found

---

### Update Order Status

- **PATCH** `/dashboard/orders/:id/status`
- **Request Body:** `{ "status": "SHIPPED" }`
- **Response:** `{ "id": "string", "status": "SHIPPED" }`

### Update Payment Status

- **PATCH** `/dashboard/orders/:id/payment-status`
- **Request Body:** `{ "paymentStatus": "PAID" }`
- **Response:** `{ "id": "string", "paymentStatus": "PAID" }`

---

## Error Handling

- All errors return a JSON object with `message` and appropriate HTTP status code.
- Validation errors return 400 with details.
- Not found returns 404.

---

## Architectural Notes

- **Repository Pattern:** All DB logic is encapsulated in a repository for testability and maintainability.
- **Caching:** In-memory caching for reads; ready for distributed cache.
- **SOLID/DRY:** All layers have a single responsibility and are easily extensible.
- **Performance:** Bulk queries, atomic transactions, and efficient pagination.

---

## Example Error Response

```json
{
  "statusCode": 404,
  "message": "Order with ID 'bad-id' not found.",
  "error": "Not Found"
}
```
