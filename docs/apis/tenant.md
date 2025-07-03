# Tenant API Documentation

## Overview

The Tenant API provides endpoints for tenant creation and subdomain availability checking. It is architected to world-class standards, using the repository pattern for data access, strict separation of concerns, robust error handling, and testability.

---

## Endpoints

### 1. Check Subdomain Availability

- **GET** `/tenants/availability?subdomain=example`

#### Success Response

- **Status:** 200 OK

```
{
  "isAvailable": true,
  "suggestions": []
}
```

- If not available:

```
{
  "isAvailable": false,
  "suggestions": ["example-1", "example-2", ...]
}
```

#### Error Responses

- **400 Bad Request**: Validation errors

---

### 2. Create Tenant

- **POST** `/tenants`

#### Request Body

```
{
  "subdomain": "string",
  "storeName": "string"
}
```

#### Success Response

- **Status:** 201 Created

```
{
  "success": true,
  "tenant": {
    "id": "string",
    "subdomain": "string",
    "name": "string",
    "dbSchema": "string",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tenant created successfully",
  "url": "https://<subdomain>.yourapp.com"
}
```

#### Error Responses

- **409 Conflict**: Subdomain already taken (with suggestions)

```
{
  "statusCode": 409,
  "message": "Subdomain 'example' is already taken",
  "suggestions": ["example-1", "example-2", ...],
  "error": "Conflict"
}
```

- **400 Bad Request**: Owner does not exist or validation errors
- **500 Internal Server Error**: Store initialization failed

---

## Error Handling

- All errors are returned in a consistent JSON format with `statusCode`, `message`, and `error` fields.
- Business logic errors (e.g., duplicate subdomain, missing owner) use appropriate HTTP status codes (409, 400).
- Validation errors are handled by DTO validation and return 400.
- Unexpected errors return 500.

---

## Architecture Notes

- **Repository Pattern**: All data access is abstracted via the `ITenantRepository` interface and `TenantRepository` implementation, ensuring SRP and DIP.
- **Separation of Concerns**: Controllers handle HTTP, services handle business logic, repositories handle data access.
- **Testability**: Services and controllers are unit tested with repository/service mocks, not direct DB access.
- **Performance**: Schema creation and migration are robustly handled with rollback logic.

---

## Example Usage

### Check Subdomain Availability

```http
GET /tenants/availability?subdomain=example
```

### Create Tenant

```http
POST /tenants
Content-Type: application/json

{
  "subdomain": "myshop",
  "storeName": "My Shop"
}
```
