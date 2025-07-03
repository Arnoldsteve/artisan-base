# Customer API Documentation

## Overview

The Customer API provides endpoints for managing customers in a multi-tenant, high-performance e-commerce system. It is designed for scalability, maintainability, and efficiency, following SOLID, DRY, and Separation of Concerns principles.

---

## Endpoints

### Create Customer

- **POST** `/dashboard/customers`
- **Description:** Create a new customer.
- **Request Body:**

```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "hashedPassword": "string"
}
```

- **Response:**

```json
{
  "id": "string",
  "email": "string",
  ...
}
```

- **Errors:**
  - 400: Duplicate email, validation errors

---

### Get All Customers

- **GET** `/dashboard/customers?page=1&limit=20`
- **Description:** Paginated list of customers, sorted by most recent.
- **Response:**

```json
{
  "data": [ { "id": "string", ... } ],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

---

### Get Customer by ID

- **GET** `/dashboard/customers/:id`
- **Description:** Retrieve a single customer.
- **Response:**

```json
{
  "id": "string",
  "email": "string",
  ...
}
```

- **Errors:**
  - 404: Customer not found

---

### Update Customer

- **PATCH** `/dashboard/customers/:id`
- **Request Body:** `{ "firstName": "New Name", ... }`
- **Response:** `{ "id": "string", ... }`

---

### Delete Customer

- **DELETE** `/dashboard/customers/:id`
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
  "message": "Customer with ID 'bad-id' not found.",
  "error": "Not Found"
}
```
