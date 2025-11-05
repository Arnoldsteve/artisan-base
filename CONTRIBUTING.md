# Contributing to ArtisanBase 🎨

Thank you for considering contributing to ArtisanBase! We're building a platform to empower artisans worldwide, and your contributions help make that mission a reality.

Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas — **all contributions are valued and appreciated**.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Need Help?](#need-help)

---

## 📜 Code of Conduct

This project follows a **Code of Conduct** to ensure a welcoming and inclusive environment for everyone.

By participating, you agree to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

---

## 🤝 How Can I Contribute?

### **1. Reporting Bugs**
Found a bug? Help us fix it!

- Check if the issue already exists in [Issues](https://github.com/Arnoldsteve/artisan-base/issues)
- If not, create a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)
  - Environment details (OS, Node version, etc.)

### **2. Suggesting Features**
Have an idea? We'd love to hear it!

- Open a [Discussion](https://github.com/Arnoldsteve/artisan-base/discussions) to propose your idea
- Explain the problem it solves
- Describe how it would work
- Get feedback before creating a PR

### **3. Improving Documentation**
Documentation improvements are always welcome!

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve code comments
- Update the README or wiki

### **4. Writing Code**
Ready to code? Follow the workflow below!

---

## 🚀 Getting Started

### **Prerequisites**

Make sure you have installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ ([Install](https://pnpm.io/installation))
- **PostgreSQL** (or use [Supabase](https://supabase.com))
- **Git**

<br>

### **1. Fork the Repository**

Click the **Fork** button at the top right of the [repository page](https://github.com/Arnoldsteve/artisan-base).

<br>

### **2. Clone Your Fork**
```bash
git clone https://github.com/YOUR_USERNAME/artisan-base.git
cd artisan-base
```

<br>

### **3. Install Dependencies**
```bash
pnpm install
```

<br>

### **4. Configure Environment**
```bash
cd packages/api
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/artisanbase"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
NODE_ENV="development"
```

<br>

### **5. Set Up Database**
```bash
# Run migrations
pnpm exec prisma migrate dev

# Generate Prisma client
pnpm exec prisma generate

# (Optional) Seed the database
pnpm exec prisma db seed
```

<br>

### **6. Start Development Servers**
```bash
# From project root
pnpm dev
```

Your apps should now be running:
- **Storefront:** http://localhost:3000
- **Dashboard:** http://localhost:3001
- **API:** http://localhost:4000

---

## 🔄 Development Workflow

### **1. Create a Branch**

Always create a new branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

<br>

### **2. Make Your Changes**

- Write clean, readable code
- Follow the [coding guidelines](#coding-guidelines)
- Add tests if applicable
- Update documentation if needed

<br>

### **3. Test Your Changes**
```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run tests (when available)
pnpm test

# Build to check for errors
pnpm build
```

<br>

### **4. Commit Your Changes**

Follow our [commit convention](#commit-convention):
```bash
git add .
git commit -m "feat: add product filtering by category"
```

<br>

### **5. Push to Your Fork**
```bash
git push origin feature/your-feature-name
```

<br>

### **6. Create a Pull Request**

1. Go to the [original repository](https://github.com/Arnoldsteve/artisan-base)
2. Click **"New Pull Request"**
3. Select your fork and branch
4. Fill out the PR template
5. Submit for review!

---

## 📝 Coding Guidelines

### **General Principles**
- Write **clean, readable** code
- Use **TypeScript** for type safety
- Follow **DRY** (Don't Repeat Yourself)
- Keep functions **small and focused**
- Write **meaningful variable names**

<br>

### **TypeScript**
```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
}

// ❌ Avoid
const data: any = { ... };
```

<br>

### **React/Next.js**
```typescript
// ✅ Use functional components
export function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}

// ✅ Use proper TypeScript props
interface ProductCardProps {
  product: Product;
}

// ❌ Avoid default exports for components
export default ProductCard; // Avoid
```

<br>

### **API/NestJS**
```typescript
// ✅ Use dependency injection
@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
}

// ✅ Use DTOs for validation
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
```

<br>

### **Database/Prisma**
```typescript
// ✅ Use Prisma for queries
const products = await prisma.product.findMany();

// ❌ Avoid raw SQL unless absolutely necessary
await prisma.$queryRaw`SELECT * FROM products`; // Avoid
```

<br>

### **Styling**
- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design
- Use **shadcn/ui** components when possible

---

## 💬 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history.

### **Format**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

<br>

### **Types**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes

<br>

### **Examples**
```bash
feat(product): add category filtering
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
refactor(api): simplify tenant resolution logic
chore(deps): update dependencies
```

---

## 🔍 Pull Request Process

### **Before Submitting**
- [ ] Code builds without errors (`pnpm build`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Types are correct (`pnpm type-check`)
- [ ] Tests pass (if applicable)
- [ ] Documentation is updated
- [ ] Commits follow convention

<br>

### **PR Template**
When creating a PR, include:

1. **Description** - What does this PR do?
2. **Motivation** - Why is this change needed?
3. **Changes** - List of changes made
4. **Screenshots** - If UI changes (before/after)
5. **Testing** - How did you test this?
6. **Related Issues** - Link to issues (e.g., "Closes #123")

<br>

### **Review Process**
- Maintainers will review your PR
- Be open to feedback and discussions
- Make requested changes promptly
- Once approved, your PR will be merged!

---

## 📁 Project Structure
```
artisan-base/
├── packages/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/           # Authentication
│   │   │   ├── store/          # Store management
│   │   │   ├── product/        # Products
│   │   │   └── tenant/         # Multi-tenancy
│   │   └── prisma/             # Database schema
│   │
│   ├── dashboard/              # Admin Dashboard
│   │   ├── app/                # Pages
│   │   ├── components/         # UI components
│   │   └── lib/                # Utilities
│   │
│   ├── storefront/             # Customer Storefront
│   │   ├── app/                # Pages
│   │   ├── components/         # UI components
│   │   └── lib/                # Utilities
│   │
│   └── common/                 # Shared code
│       ├── types/              # TypeScript types
│       ├── schemas/            # Zod schemas
│       └── utils/              # Helper functions
│
├── .github/                    # GitHub configs
├── turbo.json                  # Turborepo config
└── package.json                # Root package
```

---

## 🆘 Need Help?

### **Communication Channels**
- **💬 Discussions:** [GitHub Discussions](https://github.com/Arnoldsteve/artisan-base/discussions)
- **🐛 Issues:** [GitHub Issues](https://github.com/Arnoldsteve/artisan-base/issues)
- **📧 Email:** stevearnold9e@gamil.com

<br>

### **Resources**
- [Documentation](https://github.com/Arnoldsteve/artisan-base/tree/main/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)

---

## 🙏 Thank You!

Your contributions help empower artisans around the world to build their businesses online. Every bug fix, feature, and improvement makes a real difference.

**We appreciate your time, effort, and talent!** ❤️

---

<div align="center">

**Questions?** Open a [Discussion](https://github.com/Arnoldsteve/artisan-base/discussions)  
**Found a bug?** Create an [Issue](https://github.com/Arnoldsteve/artisan-base/issues)

<br>

Made with 🎨 by the ArtisanBase community

</div>