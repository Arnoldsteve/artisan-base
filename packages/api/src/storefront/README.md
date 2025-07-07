# Storefront API

This module provides public API endpoints for the storefront application. These endpoints are designed to be accessed by customers browsing the store and do not require authentication.

## Architecture

The storefront API follows the same architecture pattern as the dashboard API:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access and database operations
- **DTOs**: Define request/response data structures
- **Interfaces**: Define contracts for repositories

## Endpoints

### Products

#### GET `/v1/storefront/products`

Get all products with optional filtering and pagination.

**Query Parameters:**

- `search` (optional): Search in product name and description
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sortBy` (optional): Sort field - 'name', 'price-low', 'price-high', 'created' (default: 'name')
- `sortOrder` (optional): Sort order - 'asc', 'desc' (default: 'asc')

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": "number",
      "sku": "string",
      "inventoryQuantity": "number",
      "isFeatured": "boolean",
      "category": "string",
      "images": "array",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
}
```

#### GET `/v1/storefront/products/featured`

Get featured products (limited to 8 items).

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "price": "number",
    "sku": "string",
    "inventoryQuantity": "number",
    "isFeatured": "boolean",
    "category": "string",
    "images": "array",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### GET `/v1/storefront/products/categories`

Get all available product categories.

**Response:**

```json
["Electronics", "Clothing", "Books"]
```

#### GET `/v1/storefront/products/:id`

Get a specific product by ID.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "price": "number",
  "sku": "string",
  "inventoryQuantity": "number",
  "isFeatured": "boolean",
  "category": "string",
  "images": "array",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Categories

#### GET `/v1/storefront/categories`

Get all categories with optional filtering and pagination.

**Query Parameters:**

- `search` (optional): Search in category name and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "_count": {
        "products": "number"
      }
    }
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
}
```

#### GET `/v1/storefront/categories/:id`

Get a specific category by ID with its products.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "image": "string",
  "isActive": "boolean",
  "createdAt": "string",
  "updatedAt": "string",
  "products": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": "number",
      "sku": "string",
      "inventoryQuantity": "number",
      "isFeatured": "boolean",
      "category": "string",
      "images": "array",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

## Security

- All storefront endpoints are public and do not require authentication
- Only active products and categories are returned
- Data is filtered to only show customer-visible information
- No sensitive business data is exposed

## Tenant Context

All endpoints respect the tenant context and will only return data for the current tenant based on the subdomain or tenant identifier in the request.
