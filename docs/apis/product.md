# Product API Documentation

## Overview

The Product API provides endpoints for managing products in a multi-tenant, high-performance e-commerce system. It is designed for scalability, maintainability, and efficiency, following SOLID, DRY, and Separation of Concerns principles.

---

## Endpoints

### Create Product

- **POST** `/dashboard/products`
- **Description:** Create a new product.
- **Request Body:**

```json
{
  "name": "string",
  "slug": "string",
  "price": 100.00,
  "description": "string",
  "sku": "string",
  "inventoryQuantity": 10,
  ...
}
```

- **Response:**

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  ...
}
```

- **Errors:**
  - 400: Duplicate slug, validation errors

---

### Get All Products

- **GET** `/dashboard/products?page=1&limit=20`
- **Description:** Paginated list of products, sorted by most recent.
- **Response:**

```json
{
  "data": [ { "id": "string", ... } ],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

---

### Get Product by ID

- **GET** `/dashboard/products/:id`
- **Description:** Retrieve a single product.
- **Response:**

```json
{
  "id": "string",
  "name": "string",
  ...
}
```

- **Errors:**
  - 404: Product not found

---

### Update Product

- **PATCH** `/dashboard/products/:id`
- **Request Body:** `{ "name": "New Name", ... }`
- **Response:** `{ "id": "string", ... }`

---

### Delete Product

- **DELETE** `/dashboard/products/:id`
- **Response:** 204 No Content

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
  "message": "Product with ID 'bad-id' not found.",
  "error": "Not Found"
}
```
