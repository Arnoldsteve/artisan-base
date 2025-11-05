<div align="center">

# ArtisanBase 🎨

**Empowering artisans with professional e-commerce solutions**

Build and launch your online store without technical complexity

<br>

[![Storefront](https://img.shields.io/badge/🛍️_Storefront-Live_Demo-4285F4?style=for-the-badge&logo=vercel&logoColor=white)](https://artisan-base-storefront.vercel.app)
[![Dashboard](https://img.shields.io/badge/⚙️_Dashboard-Live_Demo-34A853?style=for-the-badge&logo=vercel&logoColor=white)](https://artisan-base-dashboard.vercel.app)
[![Docs](https://img.shields.io/badge/📖_Documentation-Read-FF6B6B?style=for-the-badge)](https://github.com/Arnoldsteve/artisan-base/tree/main/docs)

</div>

<br>

<p align="center">
  <img src="https://via.placeholder.com/1100x450/667eea/ffffff?text=ArtisanBase+Platform+Preview" alt="ArtisanBase Platform" />
</p>

---

## 🌟 Overview

ArtisanBase is a **full-stack multi-tenant SaaS platform** that enables independent artisans and craftspeople to launch professional online storefronts. Built with enterprise-grade architecture, it provides **secure, isolated environments** for each creator while maintaining simplicity and ease of use.

<br>

### Why ArtisanBase?

<table>
<tr>
<td width="50%">

**For Artisans**  
Focus on your craft, not technology. Get a professional online presence with zero technical knowledge required.

</td>
<td width="50%">

**For Developers**  
Experience modern full-stack architecture with multi-tenancy, advanced security patterns, and scalable design.

</td>
</tr>
</table>

---

## 🚀 Live Demos

<div align="center">

| 🛍️ Customer Storefront | ⚙️ Admin Dashboard |
|:---:|:---:|
| Browse products, shopping cart, mobile responsive | Analytics, inventory management, customization |
| **[artisan-base-storefront.vercel.app](https://artisan-base-storefront.vercel.app)** | **[artisan-base-dashboard.vercel.app](https://artisan-base-dashboard.vercel.app)** |

<br>

**[📖 Documentation](https://github.com/Arnoldsteve/artisan-base/tree/main/docs)** • **[🐛 Report Issues](https://github.com/Arnoldsteve/artisan-base/issues)** • **[💬 Discussions](https://github.com/Arnoldsteve/artisan-base/discussions)**

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🏪 Multi-Tenant Architecture
- Isolated database schemas per store
- Enterprise-level data security
- Handle thousands of stores seamlessly

### 🔐 Enterprise Security
- JWT authentication with httpOnly cookies
- Role-based access control
- End-to-end data encryption

</td>
<td width="50%">

### 🌐 Professional Storefronts
- SEO-optimized with server-side rendering
- Mobile-first responsive design
- Custom branding for each store

### ⚡ Developer Experience
- Full TypeScript type safety
- Modern tooling and frameworks
- Organized monorepo architecture

</td>
</tr>
</table>

---

## 🛠️ Technology Stack

### **Frontend**
```plaintext
Next.js 14+      App Router, SSR, modern React patterns
TypeScript       Type safety across the stack
Tailwind CSS     Utility-first styling
shadcn/ui        Beautiful, accessible components
React Hook Form  Performant form validation
TanStack Query   Server state management
Zod              Runtime type validation
```

### **Backend**
```plaintext
NestJS           Scalable Node.js framework
Prisma ORM       Type-safe database access
Passport.js      Authentication middleware
PostgreSQL       Robust relational database
```

### **DevOps & Infrastructure**
```plaintext
pnpm Workspaces  Monorepo package management
Turborepo        Build optimization and caching
Supabase         Managed PostgreSQL hosting
Vercel           Edge deployment platform
```

---

## 🏗️ Architecture Highlights

### **Schema-Per-Tenant Multi-Tenancy**

Revolutionary data isolation where each store gets its own PostgreSQL schema (`tenant_[storeId]`):
```
tenant_001.products
tenant_001.orders
tenant_002.products
tenant_002.orders
```

**Benefits:**
- ✅ Maximum security through complete data isolation
- ✅ Independent scaling per tenant
- ✅ Simplified compliance with data regulations

<br>

### **Dynamic Tenant Resolution**

Request-scoped database connections with automatic tenant detection:
```typescript
const tenantPrisma = await this.tenantPrismaService.getTenantClient(storeId);
const products = await tenantPrisma.product.findMany();
```

<br>

### **Seamless Development**
- Next.js proxies API requests (no CORS issues)
- Hot reloading across the entire stack
- Shared types and schemas between frontend and backend

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- pnpm package manager
- PostgreSQL database (Supabase recommended)

<br>

### **Installation**
```bash
# Clone repository
git clone https://github.com/Arnoldsteve/artisan-base.git
cd artisan-base

# Install dependencies
pnpm install

# Setup environment
cd packages/api
cp .env.example .env
# Edit .env with your configuration

# Setup database
pnpm exec prisma migrate dev
pnpm exec prisma generate

# Start development servers
cd ../..
pnpm dev
```

**🎉 You're ready!**
- Storefront: `http://localhost:3000`
- Dashboard: `http://localhost:3001`
- API: `http://localhost:4000`

---

## 📚 Project Structure
```
artisan-base/
│
├── packages/
│   │
│   ├── api/                    # NestJS Backend Server
│   │   ├── src/
│   │   │   ├── auth/           # Authentication & authorization
│   │   │   ├── store/          # Store management
│   │   │   ├── product/        # Product CRUD operations
│   │   │   └── tenant/         # Multi-tenancy logic
│   │   └── prisma/             # Database schemas & migrations
│   │
│   ├── dashboard/              # Admin Dashboard (Next.js)
│   │   ├── app/                # App Router pages
│   │   ├── components/         # Admin UI components
│   │   └── lib/                # Utilities & configurations
│   │
│   ├── storefront/             # Customer Storefront (Next.js)
│   │   ├── app/                # App Router pages
│   │   ├── components/         # Storefront UI components
│   │   └── lib/                # Utilities & configurations
│   │
│   └── common/                 # Shared Resources
│       ├── types/              # TypeScript type definitions
│       ├── schemas/            # Zod validation schemas
│       └── utils/              # Helper functions
│
├── turbo.json                  # Turborepo configuration
└── package.json                # Workspace configuration
```

---

## 🗺️ Roadmap

<table>
<tr>
<td>

- [ ] **Dynamic Subdomains** – Custom `store.artisanbase.com` URLs
- [ ] **Payment Integration** – Stripe & PayPal checkout
- [ ] **Order Management** – Complete order lifecycle
- [ ] **Analytics Dashboard** – Sales insights & reporting
- [ ] **Theme Customization** – Visual store builder

</td>
<td>

- [ ] **Mobile App** – React Native companion
- [ ] **Email Notifications** – Transactional emails
- [ ] **Inventory Alerts** – Low stock warnings
- [ ] **Multi-Currency** – International sales support
- [ ] **Shipping Integration** – Real-time rates & tracking

</td>
</tr>
</table>

---

## 🤝 Contributing

We welcome contributions from the community!

**Getting Started:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.

Free for personal and commercial use.

---

## 🙏 Acknowledgments

Built with ❤️ for the artisan community.

Special thanks to all the open-source projects and contributors who make this possible.

---

<div align="center">

### Made with 🎨 by [Arnold Steve](https://github.com/Arnoldsteve)

<br>

⭐ **Star this repo if you find it helpful!** ⭐

<br>

[![GitHub stars](https://img.shields.io/github/stars/Arnoldsteve/artisan-base?style=social)](https://github.com/Arnoldsteve/artisan-base)
[![GitHub forks](https://img.shields.io/github/forks/Arnoldsteve/artisan-base?style=social)](https://github.com/Arnoldsteve/artisan-base/fork)

</div>