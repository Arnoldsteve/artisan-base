# Settings API Documentation

## Overview

The Settings API provides endpoints for retrieving and updating tenant-wide settings (such as store details, branding, and preferences) in a secure, RESTful manner. All endpoints are protected by JWT authentication and are tenant-scoped. The API uses a robust repository-service-controller architecture for maintainability and testability.

---

## Endpoints

### Get Settings

- **GET** `/dashboard/settings`
- **Auth:** Required (JWT)
- **Response:** `200 OK`

```json
{
  "logoUrl": "string (optional)",
  "themeColor": "string (optional)",
  "storeName": "string (optional)"
  // ...other settings fields
}
```

- **Errors:**
  - `401 Unauthorized` if not authenticated

---

### Update Settings

- **PATCH** `/dashboard/settings`
- **Auth:** Required (JWT)
- **Body:**

```json
{
  "logoUrl": "string (optional, must be a valid URL)",
  "themeColor": "string (optional, must be a valid hex color, e.g. #fff or #ffffff)",
  "storeName": "string (optional)"
  // ...other settings fields
}
```

- **Validation:**
  - `logoUrl`: optional, must be a valid URL
  - `themeColor`: optional, must match hex color format (e.g. #fff or #ffffff)
  - `storeName`: optional, must be a string
  - Extra fields are not allowed (forbidNonWhitelisted)
- **Response:** `200 OK`

```json
{
  "settings": {
    "logoUrl": "string (optional)",
    "themeColor": "string (optional)",
    "storeName": "string (optional)"
    // ...other settings fields
  }
}
```

- **Errors:**
  - `401 Unauthorized` if not authenticated
  - `400 Bad Request` for invalid input or extra fields

---

## Error Handling

- All errors are returned in the following format:

```json
{
  "statusCode": 400,
  "message": "Invalid input.",
  "error": "Bad Request"
}
```

- Validation errors return `400 Bad Request` with details.
- Unauthorized access returns `401 Unauthorized`.

---

## Architecture Notes

- **Repository Pattern:** All data access is abstracted via `ISettingsRepository` for testability and separation of concerns.
- **Service Layer:** Business logic is handled in `SettingsService`, which depends on the repository interface.
- **Controller:** Handles HTTP requests and responses, delegating to the service. Uses `UpdateSettingsDto` and `ValidationPipe` for strict input validation.
- **Security:** All endpoints require JWT authentication and are tenant-scoped.
- **Testing:** The architecture supports easy mocking and isolation for unit and integration tests.

---

## Example Error Responses

- **Unauthorized:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

- **Validation Error:**

```json
{
  "statusCode": 400,
  "message": ["themeColor must match /^#([0-9a-fA-F]{3}){1,2}$/"],
  "error": "Bad Request"
}
```
