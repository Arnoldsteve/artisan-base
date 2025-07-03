# Architecture Notes: Request Scope & Tenant Context

## Top 1% Request Scope Design

This codebase implements a world-class, request-scoped architecture for multi-tenant SaaS applications using NestJS. The design ensures:

- **Per-request isolation** of tenant and user context
- **No cross-request data leakage**
- **Maximum testability and maintainability**

### Key Components

#### 1. TenantContextService

- A request-scoped injectable service (`@Injectable({ scope: Scope.REQUEST })`)
- Holds the current request's `tenantId`, `userId`, and any other context fields
- Populated at the start of each request by `TenantContextMiddleware`
- Can be injected into any service or repository that needs tenant/user info

#### 2. TenantContextMiddleware

- Runs on every request
- Extracts tenant/user info from the request (e.g., from `req.tenant` and `req.user`)
- Calls `TenantContextService.setContext()` to store the info for the current request

#### 3. Request-Scoped Controllers & Services

- All major controllers and services are decorated with `@Controller({ scope: Scope.REQUEST })` or `@Injectable({ scope: Scope.REQUEST })`
- This ensures each request gets its own instance, with the correct context injected

#### 4. Module Providers

- Each dashboard module (products, orders, categories, customers, etc.) provides `TenantContextService` as request-scoped in its `providers` array
- Example:
  ```ts
  @Module({
    providers: [
      ProductService,
      { provide: "ProductRepository", useClass: ProductRepository },
      {
        provide: TenantContextService,
        useClass: TenantContextService,
        scope: Scope.REQUEST,
      },
    ],
  })
  export class ProductModule {}
  ```

#### 5. Repository Scope

- Repositories are singleton by default for performance
- If a repository needs request context, it can be made request-scoped and inject `TenantContextService`

### Benefits

- **Security**: No accidental data leaks between requests
- **Performance**: Singleton where possible, request-scoped only where needed
- **Testability**: Context is injectable and mockable
- **Maintainability**: Clear, explicit scope and context management

### Usage Example

```ts
@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(private readonly tenantContext: TenantContextService) {}

  getTenantId() {
    return this.tenantContext.tenantId;
  }
}
```

---

This pattern is applied across all major modules and is a foundation for robust, scalable, and secure multi-tenant SaaS backends.
