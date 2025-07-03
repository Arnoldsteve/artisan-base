# Category API Documentation

## Overview

The Category API provides endpoints for managing product categories within a tenant's dashboard. All endpoints are protected by JWT authentication and scoped per tenant. The API follows RESTful conventions and robust error handling, and leverages the repository pattern for maintainability and testability.

---

## Endpoints

### Create Category

- **POST** `/dashboard/categories`
- **Auth:** Required (JWT)
- **Body:**

```json
{
  "name": "string",
  "description": "string (optional)"
}
```

- **Response:** `201 Created`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "slug": "string",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

- **Errors:**
  - `409 Conflict` if a category with the same name/slug exists
  - `400 Bad Request` for validation errors

---

### List Categories

- **GET** `/dashboard/categories`
- **Auth:** Required (JWT)
- **Query:** _None (pagination not implemented)_
- **Response:** `200 OK`

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "slug": "string",
    "createdAt": "ISO8601 string",
    "updatedAt": "ISO8601 string"
  }
]
```

---

### Get Category by ID

- **GET** `/dashboard/categories/{id}`
- **Auth:** Required (JWT)
- **Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "slug": "string",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

- **Errors:**
  - `404 Not Found` if the category does not exist

---

### Update Category

- **PATCH** `/dashboard/categories/{id}`
- **Auth:** Required (JWT)
- **Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

- **Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "slug": "string",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```

- **Errors:**
  - `409 Conflict` if the new name/slug conflicts with another category
  - `404 Not Found` if the category does not exist

---

### Delete Category

- **DELETE** `/dashboard/categories/{id}`
- **Auth:** Required (JWT)
- **Response:** `204 No Content`
- **Errors:**
  - `404 Not Found` if the category does not exist

---

## Error Handling

- All errors are returned in the following format:

```json
{
  "statusCode": 404,
  "message": "Category with ID 'abc' not found.",
  "error": "Not Found"
}
```

- Validation errors return `400 Bad Request` with details.
- Conflict errors return `409 Conflict` with a descriptive message.

---

## Architecture Notes

- **Repository Pattern:** All data access is abstracted via `ICategoryRepository` for testability and separation of concerns.
- **Caching:** In-memory caching is used for category lookups to improve performance.
- **Error Handling:** Uses NestJS exceptions for clear, consistent error responses.
- **Testing:** All service and controller tests mock the repository for true isolation.
- **Security:** All endpoints require JWT authentication and are tenant-scoped.

---

## Example Error Responses

- **Category Not Found:**

```json
{
  "statusCode": 404,
  "message": "Category with ID 'abc' not found.",
  "error": "Not Found"
}
```

- **Duplicate Category Name:**

```json
{
  "statusCode": 409,
  "message": "A category with the name 'Electronics' already exists.",
  "error": "Conflict"
}
```
