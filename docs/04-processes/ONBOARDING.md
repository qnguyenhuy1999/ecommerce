# Developer Onboarding

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
> - [INFRASTRUCTURE.md](./../03-technical/INFRASTRUCTURE.md) — Docker and environment setup
> - [API_DESIGN.md](./../03-technical/API_DESIGN.md) — API endpoint reference
> - [DEPLOYMENT.md](./DEPLOYMENT.md) — Deployment procedures
> - [CHECKLIST.md](./../05-references/CHECKLIST.md) — Code review and PR checklists

---

## Table of Contents

1. [Developer Setup](#1-developer-setup)
2. [Project Structure](#2-project-structure)
3. [Adding a New Module](#3-adding-a-new-module)
4. [Adding a New API Endpoint](#4-adding-a-new-api-endpoint)
5. [Code Conventions](#5-code-conventions)
6. [Useful Commands](#6-useful-commands)

---

## 1. Developer Setup

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git
- VS Code (recommended)

### Quick Start

```bash
# 1. Clone repository
git clone <repo-url>
cd ecommerce

# 2. Install dependencies
npm install

# 3. Configure environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files — see INFRASTRUCTURE.md for required variables

# 4. Start infrastructure
docker compose up -d postgres redis

# 5. Run migrations
npm run db:migrate --workspace=apps/api

# 6. Seed test data (optional)
npm run db:seed --workspace=apps/api

# 7. Start development servers
npm run dev:all
# Or individually:
npm run dev --workspace=apps/api   # API on :3000
npm run dev --workspace=apps/web    # Web on :3001
```

### Verify Setup

- API health: http://localhost:3000/health
- API docs: http://localhost:3000/api/docs
- Web app: http://localhost:3001

### Common Setup Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in `.env` or stop the conflicting process |
| Docker not running | Start Docker Desktop, run `docker ps` to verify |
| Migration fails | Ensure Postgres is healthy: `docker compose ps postgres` |
| npm install fails | Clear cache: `npm cache clean --force && npm install` |

---

## 2. Project Structure

```
ecommerce/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules (DDD)
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   │   ├── register.dto.ts
│   │   │   │   │   │   └── refresh-token.dto.ts
│   │   │   │   │   ├── strategies/
│   │   │   │   │   ├── guards/
│   │   │   │   │   └── entities/
│   │   │   │   ├── user/
│   │   │   │   ├── seller/
│   │   │   │   ├── product/
│   │   │   │   ├── cart/
│   │   │   │   ├── order/
│   │   │   │   ├── payment/
│   │   │   │   ├── notification/
│   │   │   │   └── admin/
│   │   │   ├── common/          # Shared utilities, decorators, filters
│   │   │   ├── prisma/          # Prisma client, migrations
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── Dockerfile
│   └── web/                     # Next.js frontend
│       ├── src/
│       │   ├── app/             # App router pages
│       │   ├── components/       # React components
│       │   ├── lib/              # Utilities, API client
│       │   └── pages/            # Pages (if using Pages Router)
│       └── Dockerfile
├── packages/
│   └── shared/                   # Shared types, constants
├── docker-compose.yml
├── package.json                  # Root workspace config
└── turbo.json                    # Turborepo config
```

### Module Structure Convention

Each feature module follows this pattern:

```
module-name/
├── module-name.controller.ts   # HTTP handlers, route definitions
├── module-name.service.ts      # Business logic
├── module-name.module.ts       # Module configuration
├── dto/                        # Data Transfer Objects
│   ├── create-module-name.dto.ts
│   ├── update-module-name.dto.ts
│   └── module-name-response.dto.ts
├── entities/                   # Domain entities (if not using Prisma models directly)
├── guards/                     # Custom guards
├── decorators/                 # Custom decorators
└── enums/                      # Module-specific enums
```

---

## 3. Adding a New Module

### Step 1: Create Module Files

```bash
# Create module directory
mkdir -p apps/api/src/modules/notification
mkdir -p apps/api/src/modules/notification/dto

# Or use the NestJS CLI
npm run nest:module notification --workspace=apps/api
npm run nest:controller notification --workspace=apps/api
npm run nest:service notification --workspace=apps/api
```

### Step 2: Define the Module

```typescript
// apps/api/src/modules/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
```

### Step 3: Register in App Module

```typescript
// apps/api/src/app.module.ts
@Module({
  imports: [
    // ... existing modules
    NotificationModule,
  ],
})
export class AppModule {}
```

---

## 4. Adding a New API Endpoint

### Step 1: Define DTO with Validation

```typescript
// apps/api/src/modules/notification/dto/get-notifications.dto.ts
import { IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetNotificationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRead?: boolean;
}
```

### Step 2: Add Controller Method

```typescript
// apps/api/src/modules/notification/notification.controller.ts
import { Controller, Get, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Request() req, @Query() dto: GetNotificationsDto) {
    return this.notificationService.findAll(req.user.id, dto);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }
}
```

### Step 3: Add Service Method

```typescript
// apps/api/src/modules/notification/notification.service.ts
async findAll(userId: string, dto: GetNotificationsDto) {
  const { page, limit, isRead } = dto;
  const where = { userId };
  if (isRead !== undefined) where['isRead'] = isRead;

  const [data, total] = await Promise.all([
    this.prisma.notification.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.notification.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async markAsRead(id: string, userId: string) {
  const notification = await this.prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) throw new NotFoundException('NOTIFICATION_NOT_FOUND');
  if (notification.userId !== userId) throw new ForbiddenException('NOT_NOTIFICATION_OWNER');

  return this.prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}
```

### Step 4: Add API Documentation (if using Swagger)

```typescript
@ApiBearerAuth()
@ApiOperation({ summary: 'Get notifications for current user' })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'isRead', required: false, type: Boolean })
@ApiResponse({ status: 200, description: 'Notifications retrieved' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Get()
async findAll(@Request() req, @Query() dto: GetNotificationsDto) {
  // ...
}
```

---

## 5. Code Conventions

### TypeScript

```typescript
// Use strict mode
// Use interfaces for DTOs, types for unions
// Prefer const over let
// Use named exports over default exports (except controllers)

// DTO example
export interface CreateProductDto {
  sku: string;
  name: string;
  price: number;
}

// Response type
export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  price: number;
  status: ProductStatus;
}
```

### Naming

| Entity | Convention | Example |
|--------|-----------|---------|
| Files | kebab-case | `order-service.ts` |
| Classes | PascalCase | `OrderService` |
| Variables | camelCase | `orderId`, `isActive` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Enums | PascalCase values | `OrderStatus.PAID` |
| DTOs | PascalCase | `CreateOrderDto` |
| Database tables | PascalCase | `ProductVariant` |
| API routes | kebab-case | `/order-items` |

### Error Handling

```typescript
// Always use custom exceptions
throw new NotFoundException('ORDER_NOT_FOUND');

// Consistent error codes
export enum ErrorCode {
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  NOT_ORDER_OWNER = 'NOT_ORDER_OWNER',
}

// Global exception filter handles translation to API response format
```

### Prisma

```typescript
// Always include select/include for read queries (explicit is better)
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, role: true },
});

// Use transactions for multi-step operations
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.inventoryReservation.createMany({ data: reservations }),
]);
```

---

## 6. Useful Commands

### NPM Scripts (Root)

```bash
npm run dev:all          # Start all apps in dev mode
npm run build            # Build all apps
npm run test             # Run all tests
npm run lint             # Lint all code
npm run typecheck        # TypeScript type checking
npm run db:migrate        # Run migrations
npm run db:rollback       # Rollback last migration
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

### NPM Scripts (Workspace-specific)

```bash
npm run dev --workspace=apps/api        # Start API
npm run build --workspace=apps/api      # Build API
npm run test --workspace=apps/api       # Test API
npm run lint --workspace=apps/api       # Lint API

npm run dev --workspace=apps/web        # Start web
npm run build --workspace=apps/web      # Build web
npm run lint --workspace=apps/web       # Lint web
```

### Docker Commands

```bash
# Start infrastructure only
docker compose up -d postgres redis

# Start everything
docker compose up -d

# View logs
docker compose logs -f api
docker compose logs -f worker

# Restart a service
docker compose restart api

# Stop everything
docker compose down

# Remove volumes (CLEAN slate)
docker compose down -v
```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate --workspace=apps/api

# Push schema to database (dev only — skips migrations)
npm run db:push --workspace=apps/api

# View database with GUI
npm run db:studio --workspace=apps/api

# Check migration status
npm run db:status --workspace=apps/api
```

### Git Commands

```bash
git checkout -b feature/my-feature     # Create feature branch
git add .                              # Stage changes
git commit -m "feat: add product"      # Commit
git push origin feature/my-feature      # Push
git pull origin main --rebase          # Update from main
```
