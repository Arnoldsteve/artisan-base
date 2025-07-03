# Auth API Documentation

## Overview

The Auth API provides endpoints for user registration (signup) and authentication (login). It is architected to world-class standards, using the repository pattern for data access, strict separation of concerns, robust error handling, and testability.

---

## Endpoints

### 1. Signup

- **POST** `/auth/signup`

#### Request Body

```
{
  "email": "user@example.com",
  "password": "string",
  "firstName": "string"
}
```

#### Success Response

- **Status:** 201 Created

```
{
  "message": "Signup successful",
  "accessToken": "<jwt-token>",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "firstName": "string"
  }
}
```

#### Error Responses

- **409 Conflict**: Email already in use

```
{
  "statusCode": 409,
  "message": "Email already in use.",
  "error": "Conflict"
}
```

- **400 Bad Request**: Validation errors

---

### 2. Login

- **POST** `/auth/login`

#### Request Body

```
{
  "email": "user@example.com",
  "password": "string"
}
```

#### Success Response

- **Status:** 200 OK

```
{
  "message": "Login successful",
  "accessToken": "<jwt-token>",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "firstName": "string"
  },
  "organizations": [
    {
      "id": "string",
      "name": "string",
      "subdomain": "string"
    }
  ]
}
```

#### Error Responses

- **401 Unauthorized**: Invalid credentials

```
{
  "statusCode": 401,
  "message": "Invalid credentials. Please check your email and password.",
  "error": "Unauthorized"
}
```

- **400 Bad Request**: Validation errors

---

## Error Handling

- All errors are returned in a consistent JSON format with `statusCode`, `message`, and `error` fields.
- Business logic errors (e.g., duplicate email, invalid credentials) use appropriate HTTP status codes (409, 401).
- Validation errors are handled by DTO validation and return 400.

---

## Architecture Notes

- **Repository Pattern**: All data access is abstracted via the `IAuthRepository` interface and `AuthRepository` implementation, ensuring SRP and DIP.
- **Separation of Concerns**: Controllers handle HTTP, services handle business logic, repositories handle data access.
- **Testability**: Services and controllers are unit tested with repository/service mocks, not direct DB access.
- **Performance**: (Optional) In-memory caching can be added to the repository for user lookups.
- **Security**: Passwords are hashed with bcrypt. JWT is used for authentication.

---

## Example Usage

### Signup

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepass",
  "firstName": "Alice"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepass"
}
```
