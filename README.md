# ArtisanBase 🎨

> **Empowering artisans with professional e-commerce solutions**

ArtisanBase is a modern, full-stack SaaS platform that enables independent artisans and craftspeople to launch professional online storefronts without the technical complexity. Built with enterprise-grade architecture, it provides secure, isolated environments for each creator while maintaining simplicity and ease of use.

![ArtisanBase Platform](https://via.placeholder.com/800x400/667eea/ffffff?text=ArtisanBase+Platform+Screenshot)
*Professional storefronts tailored for artisans and creators*

---

## ✨ Why ArtisanBase?

**For Artisans:** Focus on your craft, not on technology. Get a professional online presence with zero technical knowledge required.

**For Developers:** Experience modern full-stack architecture with multi-tenancy, advanced security patterns, and scalable design principles.

---

## 🚀 Key Features

### 🏪 **Multi-Tenant Architecture**
- **Isolated Environments:** Each artisan receives a completely separate database schema
- **Enterprise Security:** Data isolation at the database level ensures maximum security
- **Scalable Design:** Handle thousands of stores without performance degradation

### 🌐 **Professional Storefronts**
- **SEO-Optimized:** Server-side rendered pages for maximum search visibility
- **Mobile-First Design:** Responsive layouts that work beautifully on all devices
- **Custom Branding:** Each store maintains its unique identity and style

### 🔐 **Enterprise-Grade Security**
- **JWT Authentication:** Secure, stateless authentication with httpOnly cookies
- **Protected Dashboards:** Role-based access control for store management
- **Data Encryption:** All sensitive data encrypted at rest and in transit

### ⚡ **Developer Experience**
- **Type-Safe:** End-to-end TypeScript for reliability and developer productivity
- **Modern Tooling:** Built with the latest frameworks and best practices
- **Monorepo Architecture:** Organized codebase with shared libraries and utilities

---

## 🛠️ Technology Stack

### Frontend (`packages/web`)
```
Next.js 14+          App Router, SSR, and modern React patterns
TypeScript           Type safety and enhanced developer experience
Tailwind CSS         Utility-first styling with responsive design
shadcn/ui           Beautiful, accessible component library
React Hook Form      Performant forms with built-in validation
Zod                 Runtime type validation and schema parsing
```

### Backend (`packages/api`)
```
NestJS              Scalable Node.js framework with dependency injection
TypeScript          Type-safe server-side development
Prisma ORM          Type-safe database access with migrations
Passport.js         Flexible authentication middleware
PostgreSQL          Robust relational database with JSON support
```

### Infrastructure & DevOps
```
pnpm Workspaces     Efficient monorepo package management
Turborepo           Build system optimization and caching
Supabase            Managed PostgreSQL with real-time features
Vercel              Serverless deployment and edge optimization
```

---

## 🏗️ Architecture Highlights

### **Schema-per-Tenant Multi-Tenancy**
Revolutionary approach to data isolation where each store gets its own dedicated PostgreSQL schema (`tenant_[storeId]`). This provides:
- **Maximum Security:** Complete data isolation between tenants
- **Scalability:** Independent scaling and optimization per tenant
- **Compliance:** Easy adherence to data protection regulations

### **Dynamic Tenant Resolution**
Custom `TenantPrismaService` factory creates request-scoped database connections:
```typescript
// Automatic tenant resolution from request context
const tenantPrisma = await this.tenantPrismaService.getTenantClient(storeId);
const products = await tenantPrisma.product.findMany();
```

### **Seamless Development Experience**
- **Proxy Architecture:** Next.js proxies API requests to eliminate CORS issues
- **Hot Reloading:** Full-stack development with instant feedback
- **Type Sharing:** Shared types and schemas across frontend and backend

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (we recommend Supabase)
- Git

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/Arnoldsteve/artisan-base.git
   cd artisan-base
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cd packages/api
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/dbname"
   
   # Security
   JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
   
   # Optional: Environment
   NODE_ENV="development"
   ```

3. **Database Setup**
   ```bash
   # Run migrations
   pnpm exec prisma migrate dev
   
   # Generate Prisma client
   pnpm exec prisma generate
   ```

4. **Start Development**
   ```bash
   # From project root
   pnpm dev
   ```
   
   🎉 **Ready!** Visit http://localhost:3000

---

## 📚 Project Structure

```
artisan-base/
├── packages/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/        # Authentication modules
│   │   │   ├── store/       # Store management
│   │   │   ├── product/     # Product CRUD
│   │   │   └── tenant/      # Multi-tenancy logic
│   │   └── prisma/          # Database schema & migrations
│   ├── web/                 # Next.js frontend
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # Utilities and configurations
│   └── shared/              # Shared types and utilities
├── turbo.json              # Turborepo configuration
└── package.json            # Workspace configuration
```

---

## 🎯 Roadmap

- [ ] **Dynamic Subdomains** - `artisan.artisanbase.com` routing
- [ ] **Payment Integration** - Stripe/PayPal checkout flows
- [ ] **Order Management** - Complete order lifecycle
- [ ] **Analytics Dashboard** - Sales insights and reporting
- [ ] **Theme Customization** - Visual store customization
- [ ] **Mobile App** - React Native companion app

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ for the artisan community. Special thanks to all the open-source projects that make this possible.

---

<div align="center">

**[Live Demo](https://artisanbase.vercel.app)** • **[Documentation](https://docs.artisanbase.com)** • **[Report Bug](https://github.com/Arnoldsteve/artisan-base/issues)**

Made with 🎨 by [Arnold Steve](https://github.com/Arnoldsteve)

</div>