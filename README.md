# Ekanshi Beauty Store — Backend API

Node.js + TypeScript + MongoDB REST API for the Ekanshi beauty e-commerce platform.

## Tech Stack
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, express-rate-limit, bcryptjs
- **Logging**: Winston + Morgan

## Project Structure
```
src/
├── config/         # DB connection
├── controllers/    # Route handlers
├── middleware/     # Auth, validation, error handling
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── seed/           # DB seed script
├── types/          # Shared TS types
├── utils/          # Logger, JWT helpers, API response helpers
├── app.ts          # Express app setup
└── index.ts        # Server entry point
```

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET

# 3. Seed the database (categories, brands, 24 products, admin user)
npm run seed

# 4. Start development server
npm run dev
# Server runs on http://localhost:5000

# 5. Build for production
npm run build
npm start
```

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Sign in, get JWT |
| GET  | /api/auth/me | ✓ | Get current user |
| PUT  | /api/auth/me | ✓ | Update profile |
| POST | /api/auth/me/addresses | ✓ | Add address |
| DELETE | /api/auth/me/addresses/:id | ✓ | Remove address |
| POST | /api/auth/me/wishlist/:productId | ✓ | Toggle wishlist |

### Products
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/products | — | List products (filters, sort, pagination) |
| GET | /api/products/featured | — | Bestsellers, new arrivals, trending |
| GET | /api/products/search?q= | — | Full-text search |
| GET | /api/products/:id | — | Product detail |
| GET | /api/products/:id/related | — | Related products |
| POST | /api/products | Admin | Create product |
| PUT  | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Soft delete |

### Catalog
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/categories | All active categories |
| GET | /api/brands | All active brands |

### Orders
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/orders | ✓ | Place order |
| GET  | /api/orders/my | ✓ | My orders |
| GET  | /api/orders/my/:id | ✓ | Order detail |
| PUT  | /api/orders/my/:id/cancel | ✓ | Cancel order |

### Reviews
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET  | /api/products/:productId/reviews | — | Product reviews |
| POST | /api/products/:productId/reviews | ✓ | Add review |
| POST | /api/products/:productId/reviews/:reviewId/helpful | ✓ | Mark helpful |

## Query Parameters — GET /api/products

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| category | string | `makeup` | Filter by category slug |
| brand | string | `maybelline` | Filter by brand slug |
| minPrice | number | `500` | Min price |
| maxPrice | number | `2000` | Max price |
| isBestseller | boolean | `true` | Bestsellers only |
| isNew | boolean | `true` | New arrivals only |
| sortBy | string | `popularity` / `rating` / `price-low` / `price-high` / `newest` |
| page | number | `1` | Page number |
| limit | number | `20` | Items per page (max 50) |
| q | string | `serum` | Full-text search |

## Admin Credentials (after seed)
- Email: `admin@Ekanshi.com`
- Password: `admin@123456`
