<p align="center">
  <img src="https://img.shields.io/badge/Campus_Marketplace-Student_Trading_Platform-4ADE80?style=for-the-badge&labelColor=0d1117" alt="Campus Marketplace" />
</p>

<h1 align="center">🛍️ Campus Marketplace</h1>
<p align="center">
  <strong>A modern full-stack campus marketplace for students to buy, sell, and connect</strong>
</p>

<p align="center">
  <a href="#-features">✨ Features</a> &nbsp;·&nbsp;
  <a href="#-tech-stack">🛠 Tech Stack</a> &nbsp;·&nbsp;
  <a href="#-architecture">🏗 Architecture</a> &nbsp;·&nbsp;
  <a href="#-quick-start">🚀 Quick Start</a> &nbsp;·&nbsp;
  <a href="#-api-reference">📡 API Reference</a> &nbsp;·&nbsp;
  <a href="#-deployment">🚢 Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Cloudinary-2.9-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Authentication Flows](#-authentication-flows)
- [Frontend Deep Dive](#-frontend-deep-dive)
- [Real-Time Chat](#-real-time-chat)
- [Performance & Optimizations](#-performance--optimizations)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## ✨ Features

### For Students (Buyers)
| Feature | Description |
|---------|-------------|
| 🔍 **Browse & Search** | Discover products with search and filters |
| 🏷️ **Categories** | Organize products by category |
| ❤️ **Favorites** | Save and track favorite items |
| 💬 **Direct Chat** | Real-time messaging with sellers via Socket.IO |
| 📱 **Responsive UI** | Mobile-first design with dark mode support |
| 🔔 **Toast Notifications** | Real-time updates and feedback |

### For Sellers
| Feature | Description |
|---------|-------------|
| 📤 **List Products** | Upload images via Cloudinary, set prices and descriptions |
| ✏️ **Manage Inventory** | Edit, update, or remove product listings |
| 👤 **Profile Page** | Public seller profile with all listings |
| 💬 **Inbox** | Manage buyer inquiries in real-time |
| 📊 **Product Stats** | Track views and inquiries (coming soon) |

### Admin Features
| Feature | Description |
|---------|-------------|
| 👮 **Admin Dashboard** | Moderate all product listings |
| ✅ **Approve/Reject** | Review pending products before publication |
| 📈 **Stats Overview** | View platform metrics (users, products, chats) |
| 🗑️ **Content Management** | Remove inappropriate listings |

### Security & Auth
| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure token-based auth with httpOnly cookies |
| 🛡️ **SQL Injection Prevention** | Prepared statements (parameterized queries) |
| ⚡ **Rate Limiting** | 100 req/15min API, 5 req/hr auth endpoints |
| 🛡️ **Security Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| 🔒 **Role-Based Access** | User, Seller, and Admin role distinctions |
| 📧 **Password Hashing** | bcrypt for secure password storage |
| 🚫 **Protected Routes** | Route guards for authenticated/admin pages |
| 📝 **Input Validation** | Comprehensive validation for all user inputs |
| 📊 **Request Logging** | All requests logged with auth failure tracking |
| 🚨 **File Upload Security** | Type/size restrictions, Cloudinary upload |
| 🏃 **Race Condition Guard** | Prevents duplicate simultaneous requests |
| ✅ **XSS Protection** | React auto-escaping + CSP headers |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with functional components & hooks |
| **Vite 7** | Lightning-fast build tool & dev server |
| **Redux Toolkit 2** | Global state management (auth, products) |
| **React Router 7** | Client-side routing with lazy loading |
| **Tailwind CSS 4** | Utility-first styling with dark mode |
| **Axios** | HTTP client with shared instance |
| **Socket.IO Client** | Real-time bidirectional chat |
| **React Hook Form** | Performant form handling |
| **Lucide React** | Beautiful icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express 5** | Web framework with middleware |
| **PostgreSQL** | Primary relational database |
| **JWT** | Token-based authentication |
| **Socket.IO** | Real-time event-driven chat |
| **Cloudinary** | Image upload & CDN |
| **bcrypt** | Password hashing |
| **multer** | Multipart file upload handling |
| **cookie-parser** | Cookie parsing for JWT storage |

---

## 🏗 Architecture

```mermaid
flowchart TB
    subgraph Client["🖥 Frontend — React 19 + Vite"]
        UI["React Pages & Components"]
        Redux["Redux Store<br/>(auth, products)"]
        Services["Service Layer<br/>(Axios + Socket.IO)"]
        UI --> Redux --> Services
    end

    subgraph Server["⚙️ Backend — Express 5"]
        Routes["Route Handlers"]
        Auth["Auth Middleware<br/>(JWT verify)"]
        Socket["Socket.IO<br/>Event Handlers"]
        Controllers["Controllers"]
        DB[(PostgreSQL)]
        Routes --> Auth --> Controllers --> DB
        Socket --> Controllers
    end

    subgraph Cloud["☁️ External Services"]
        Cloudinary["Cloudinary<br/>Image CDN"]
    end

    Services <-->|"REST API<br/>httpOnly Cookies"| Routes
    Services <-->|"WebSocket<br/>Real-time Events"| Socket
    Controllers --> Cloudinary
```

### Request Flow

```
Client Request (with cookies)
  → Express Router
    → Auth Middleware (JWT verify)
      → Controller (business logic)
        → PostgreSQL (queries)
        → Cloudinary (image uploads)
      ← ApiResponse / ApiError (JSON)
    ← JSON Response
  ← Redux updates state
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **PostgreSQL** (local or cloud provider)
- **Cloudinary** account ([free signup](https://cloudinary.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/campus-marketplace.git
cd campus-marketplace

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../campus-marketplace
npm install
```

### Configuration

Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp campus-marketplace/.env.example campus-marketplace/.env
```

### Database Setup

```sql
-- Create PostgreSQL database
createdb campus_marketplace

-- Run migrations (if provided)
psql campus_marketplace -f backend/src/db/migrations/init.sql
```

### Run Development Servers

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd campus-marketplace
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `ACCESS_TOKEN_SECRET` | Secret for signing access tokens (min 32 chars) | `your-access-token-secret-min-32-chars` |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration time | `15m` or `1d` |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens (min 32 chars) | `your-refresh-token-secret-min-32-chars` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration time | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` or `https://your-app.vercel.app,https://staging.your-app.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` |

> ⚠️ **Never commit `.env` files.** Both directories have `.gitignore` entries for these files.

### Frontend (`campus-marketplace/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

> ⚠️ **Never commit `.env` files.** Both directories have `.gitignore` entries for these files.

---

## 📁 Project Structure

```
campus-marketplace/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js              # Server entry point (with env validation)
│       ├── app.js                # Express app & middleware config
│       ├── controllers/          # Request handlers
│       │   ├── auth.controllers.js
│       │   ├── user.controllers.js
│       │   ├── product.controllers.js
│       │   ├── chat.controllers.js
│       │   ├── favorite.controllers.js
│       │   └── admin.controllers.js
│       ├── routes/               # API route definitions
│       │   ├── user.routes.js
│       │   ├── product.routes.js
│       │   ├── chat.routes.js
│       │   ├── favorite.routes.js
│       │   ├── admin.routes.js
│       │   └── messages.routes.js
│       ├── middlewares/
│       │   ├── auth.middleware.js      # JWT verification & admin check
│       │   ├── rateLimit.middleware.js # Rate limiting (API & auth)
│       │   ├── security.middleware.js  # Security headers (CSP, HSTS, etc.)
│       │   ├── requestLogger.middleware.js # Request logging & auth failure tracking
│       │   └── multer.middleware.js    # File upload handling
│       ├── services/
│       │   └── socket/
│       │       └── chat.sockets.js     # Socket.IO event handlers
│       ├── db/
│       │   └── index.js                # PostgreSQL connection with prepared statements
│       └── utils/
│           ├── ApiError.js             # Custom error class
│           ├── ApiResponse.js          # Standardized response
│           └── asyncHandler.js         # Async error wrapper
│
└── campus-marketplace/           # Frontend (React app)
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    ├── public/
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Root component & routing
        ├── index.css                # Global styles + Tailwind
        ├── Components/              # Reusable UI components
        │   ├── Header/
        │   ├── Footer/
        │   ├── Theme/
        │   ├── Toast/
        │   ├── ProtectedRoute/
        │   ├── AdminProtectedRoute/
        │   ├── home/
        │   ├── browse/
        │   ├── chat/
        │   ├── profile/
        │   ├── admin/
        │   └── ...
        ├── pages/                   # Route-level pages (lazy loaded)
        │   ├── HomePage.jsx
        │   ├── BrowsePage.jsx
        │   ├── ProfilePage.jsx
        │   ├── ChatPage.jsx
        │   ├── AddItemPage.jsx
        │   ├── FavoritesPage.jsx
        │   ├── AdminDashboardPage.jsx
        │   └── ...
        ├── services/                # API service layer
        │   ├── authService.js
        │   ├── productService.js
        │   ├── chatService.js
        │   ├── favoriteService.js
        │   ├── profileService.js
        │   └── adminService.js
        ├── store/                   # Redux state management
        │   ├── store.js
        │   ├── authSlice.js
        │   └── productSlice.js
        ├── lib/
        │   └── apiClient.js        # Shared Axios instance
        ├── conf/
        │   └── conf.js             # Configuration
        └── utils/
```

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/users/register` | Create new account | No |
| `POST` | `/users/login` | Login with email & password | No |
| `POST` | `/users/logout` | Logout (clear cookies) | Yes |
| `GET` | `/users/me` | Get current user profile | Yes |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/profile/:userId` | Get user profile | Public |
| `PATCH` | `/users/profile` | Update profile (name, bio) | Yes |
| `PATCH` | `/users/avatar` | Update profile avatar | Yes |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | Get all products (paginated + filters) | No |
| `GET` | `/products/:id` | Get product by ID | No |
| `POST` | `/products` | Create new product | Yes |
| `PATCH` | `/products/:id` | Update product | Yes (owner only) |
| `DELETE` | `/products/:id` | Delete product | Yes (owner/admin) |
| `POST` | `/products/upload` | Upload product images | Yes |

### Favorites

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/favorites` | Get user's favorite products | Yes |
| `POST` | `/favorites/:productId` | Add to favorites | Yes |
| `DELETE` | `/favorites/:productId` | Remove from favorites | Yes |

### Chat

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/chats` | Create/get conversation with seller | Yes |
| `GET` | `/chats` | Get user's conversations | Yes |
| `DELETE` | `/chats/:chatId` | Delete conversation | Yes |
| `GET` | `/messages/:chatId` | Get messages for chat | Yes |
| `POST` | `/messages/:chatId` | Send message (REST fallback) | Yes |

### Socket.IO Events (Real-Time)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_chat` | Client → Server | `{ chatId: string }` | Join chat room |
| `send_message` | Client → Server | `{ chatId, content }` | Send new message |
| `receive_message` | Server → Client | `{ id, chat_id, sender_id, content, created_at }` | New message event |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/stats` | Get platform statistics | Admin only |
| `GET` | `/admin/products` | Get all products (with pending) | Admin only |
| `PATCH` | `/admin/products/:id/approve` | Approve product | Admin only |
| `DELETE` | `/admin/products/:id/reject` | Reject product | Admin only |

### Response Format

**Success:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": ["Field errors array"]
}
```

---

## 🔐 Authentication Flows

### JWT Token Flow

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant DB

    Client->>Server: POST /users/login {email, password}
    Server->>DB: Find user, verify bcrypt hash
    Server->>Server: Generate JWT access token
    Server-->>Client: Set httpOnly cookie + return user

    Note over Client: Subsequent requests

    Client->>Server: GET /products (with accessToken cookie)
    Server->>Server: Verify JWT signature & expiry
    Server-->>Client: 200 OK + product data

    Note over Client: Token expires

    Client->>Server: GET /profile → 401 Unauthorized
    Client->>Server: POST /users/login (re-auth)
    Server-->>Client: New JWT cookie
    Client->>Server: Retry original request
```

### Race Condition Prevention

The `AuthService` uses a `pendingRequests` Map to prevent duplicate simultaneous login/register attempts:

```javascript
// authService.js
async login({ email, password }) {
  const key = `login_${email}`;

  // Return existing promise if request already in progress
  if (this.pendingRequests.has(key)) {
    return this.pendingRequests.get(key);
  }

  const promise = apiClient.post('/users/login', { email, password });
  this.pendingRequests.set(key, promise);

  try {
    return await promise;
  } finally {
    this.pendingRequests.delete(key);
  }
}
```

---

## 🔒 Security Features

The Campus Marketplace implements **defense-in-depth** security across multiple layers to protect against common web vulnerabilities.

### SQL Injection Prevention

**Prepared Statements**
All PostgreSQL queries use parameterized statements with `prepare: true` enabled in the connection pool.

```javascript
// backend/src/db/index.js
sql = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 5, prepare: true });
```

This prevents SQL injection by ensuring user input is never interpreted as SQL code.

**Testing:**
```bash
curl "http://localhost:3000/api/products/1' OR '1'='1"
# Returns 404 (no data leakage)
```

---

### Rate Limiting

**Two-Tier Protection**

| Limiter | Limit | Targets |
|---------|-------|---------|
| `apiLimiter` | 100 requests / 15 min | All `/api/*` endpoints |
| `authLimiter` | 5 attempts / hour | `/api/users/login`, `/api/users/register` |

```javascript
// backend/src/middlewares/rateLimit.middleware.js
app.use('/api/', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
```

Rate limit headers included in responses:
```
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 900
```

---

### Security Headers

Comprehensive HTTP security headers are set on every response:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `DENY` | Blocks clickjacking attempts |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection for older browsers |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforces HTTPS in production |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;` | Mitigates XSS by controlling resource loading |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disables unused browser features |

```javascript
// backend/src/middlewares/security.middleware.js
export const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
};
```

---

### Input Validation

#### Product Creation Validation

All product submissions are validated for:

```javascript
// backend/src/controllers/product.controllers.js
- Title: Required, string, max 255 chars
- Price: Positive number, max 1,000,000
- Category: Whitelist (electronics, books, clothing, furniture, other, vehicles, services)
- Condition: Whitelist (new, like-new, good, fair, poor)
- Description: Max 5,000 characters
- Location: Max 255 characters
- Image: Required (file upload)
```

#### User Registration Validation

Enhanced password and username requirements:

```javascript
// backend/src/controllers/user.controllers.js
- Email: RFC-compliant format validation
- Username: 3-50 chars, alphanumeric + _ or - only
- Password: Min 8 chars, max 100 chars, requires uppercase, lowercase, number
```

---

### Authorization & Access Control

#### Ownership Checks

Product update/delete operations verify user ownership:

```javascript
const product = await sql`
    SELECT * FROM products
    WHERE id = ${productId} AND user_id = ${userId}
`;
if (product.length === 0) {
    throw new ApiError(404, "Product not found or unauthorized");
}
```

#### Admin Route Protection

All admin endpoints require both authentication and admin role:

```javascript
// backend/src/routes/product.routes.js
router.route("/pending").get(verifyJwt, isAdmin, getPendingProducts);
router.route("/:id/approve").patch(verifyJwt, isAdmin, approveProduct);
```

---

### Request Logging & Monitoring

All requests are logged with response times and IP addresses. Auth failures (401/403) are highlighted:

```javascript
// backend/src/middlewares/requestLogger.middleware.js
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms ${req.ip}`;
        if (res.statusCode >= 400) console.warn(log);
        else console.log(log);
        if (res.statusCode === 401 || res.statusCode === 403) {
            console.warn(`AUTH FAILURE: ${req.method} ${req.path} - User: ${req.user?.id || 'anonymous'} - IP: ${req.ip}`);
        }
    });
    next();
};
```

---

### File Upload Security

**Multer Configuration** enforces strict file upload controls:

```javascript
// backend/src/middlewares/multer.middleware.js
export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const imageExt = [".jpg", ".jpeg", ".png", ".webp"];
        if (imageExt.includes(ext)) return cb(null, true);
        return cb(new Error("Invalid file format"), false);
    },
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
    }
});
```

Only image files (JPG, JPEG, PNG, WebP) are accepted. File size limited to prevent DoS.

---

### Request Size Limits

Body parser size limits protect against large payload attacks:

```javascript
// backend/src/app.js
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
```

These limits apply to all JSON and URL-encoded request bodies, preventing memory exhaustion attacks.

---

### XSS Prevention

**React Auto-Escaping**: All user input is automatically escaped in JSX. No `dangerouslySetInnerHTML` used in codebase.

**Content Security Policy**: CSP header restricts resource loading to same-origin, blocking injected scripts.

---

### Environment Hardening

**Startup Validation** ensures required environment variables are present:

```javascript
// backend/src/index.js
const requiredEnvVars = ['DATABASE_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}
```

---

### Authentication Security

- **HttpOnly Cookies**: JWT tokens stored in httpOnly cookies (not accessible to JavaScript)
- **Secure Flag**: Cookies marked `Secure` in production (`NODE_ENV=production`)
- **SameSite Policy**: `strict` in development, `none` in production with credentials
- **Password Hashing**: bcrypt with cost factor 10
- **Race Condition Protection**: Auth service uses `pendingRequests` Map to prevent duplicate simultaneous requests
- **Role-Based Access**: User, Seller, Admin roles with middleware guards

---

## 🎨 Frontend Deep Dive

### Routing

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | Home | Public | Landing page with featured products |
| `/browse` | Browse | Public | Search & filter all products |
| `/product/:id` | Product Detail | Public | View product info + contact seller |
| `/login` | Login | Guest only | Sign in |
| `/register` | Register | Guest only | Create account |
| `/profile` | Profile | 🔒 Auth | View/edit personal profile |
| `/profile/product/:id` | My Product | 🔒 Auth | View own product details |
| `/profile/edit` | Edit Profile | 🔒 Auth | Update profile info |
| `/add-item` | Add Item | 🔒 Auth | List new product |
| `/edit-product/:id` | Edit Product | 🔒 Auth (owner) | Modify product |
| `/favorites` | Favorites | 🔒 Auth | Saved products |
| `/chat` | Chat | 🔒 Auth | Inbox & conversations |
| `/admin` | Admin Dashboard | 🔒 Admin | Platform moderation |

### State Management

**Redux Slices:**

| Slice | Purpose | Key State | Actions |
|-------|---------|-----------|---------|
| `auth` | User authentication | `status`, `userData`, `profilePhoto`, `isAdmin`, `accessToken` | `login`, `logout`, `updateProfilePhoto` |
| `products` | Product listings | `products`, `loading`, `filters`, `pagination` | `fetchProducts`, `addProduct`, `updateProduct`, `deleteProduct` |

**When to use Redux vs Local State:**

| Redux (Global) | Local State |
|----------------|-------------|
| User auth data | Form input values |
| Product list | Modal open/close |
| Favorites | UI toggle states |
| Admin stats | Loading spinners |

### Component Architecture

```
Layout (Header + Footer + main)
  ├── HomePage
  │   ├── Hero
  │   ├── TrustBar
  │   ├── TrendingSection
  │   └── FeaturedProducts (ItemCard × N)
  ├── BrowsePage
  │   ├── SearchBar
  │   └── ProductGrid (ItemCard × N)
  ├── ProfilePage
  │   ├── ProfileCard
  │   └── OwnerProduct (list)
  └── AdminDashboardPage
      ├── AdminStats
      └── AdminProducts
```

### Protected Routes

```jsx
// ProtectedRoute.jsx - Requires authentication
export default function ProtectedRoute({ children }) {
  const { status } = useSelector(state => state.auth);
  if (!status) return <Navigate to="/login" replace />;
  return children;
}

// AdminProtectedRoute.jsx - Requires admin role
export default function AdminProtectedRoute({ children }) {
  const { isAdmin } = useSelector(state => state.auth);
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
```

### Theme System

- **ThemeProvider** - React Context managing `light/dark` mode
- Persists to `localStorage`, toggles `.dark` class on `documentElement`
- Tailwind CSS `dark:` variants for all components
- Toggle via header button or system preference

---

## 💬 Real-Time Chat

### ChatService (Singleton)

```javascript
class ChatService {
  socket = null;

  connectSocket() {
    if (this.socket?.connected) return this.socket;

    const state = store.getState();
    const accessToken = state.auth?.accessToken;

    if (!accessToken) return null;

    const socketUrl = apiClient.defaults.baseURL.replace('/api', '');
    this.socket = io(socketUrl, {
      auth: { accessToken },
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling']
    });

    return this.socket;
  }

  subscribeMessages(conversationId, callback) {
    const socket = this.connectSocket();
    if (!socket) return () => {};

    socket.emit('join_chat', conversationId);

    const listener = (message) => callback(message);
    socket.on('receive_message', listener);

    return () => socket.off('receive_message', listener);
  }
}
```

### Chat Flow

1. User clicks "Contact Seller" on product page
2. `getOrCreateConversation()` creates/get existing chat room
3. Socket joins room via `join_chat`
4. Messages sent via `send_message()` emit Socket event
5. Other participant receives `receive_message` event
6. UI updates real-time with new message

---

## ⚡ Performance & Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Code Splitting** | Lazy-loaded pages with `React.lazy()` + `<Suspense>` |
| **Skeleton Loaders** | Custom skeleton components during load |
| **Shared API Client** | Single Axios instance with interceptors |
| **Race Condition Guard** | `pendingRequests` Map in auth service |
| **Socket Optimization** | Single connection, room-based messaging |
| **Image CDN** | Cloudinary auto-optimization (format, quality) |
| **Error Boundary** | Top-level catch for React errors |
| **Toast System** | Global notifications, no alert() |

---

## 🚢 Deployment

### Frontend — Vercel / Netlify

```bash
# Build production
cd campus-marketplace
npm run build

# Output in dist/ folder
```

**Vercel `vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend — Render / Railway / Heroku

```bash
# Production start
cd backend
npm start
```

**Memory:** Minimum 512MB recommended for Socket.IO connections.

### Database Setup

1. Create PostgreSQL database (e.g., Neon, Supabase, Railway, Render)
2. Run provided SQL schema:
```bash
psql <database_url> -f backend/src/db/schema.sql
```
3. Set `DATABASE_URL` in backend `.env`

### SSL / Production Config

```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## 🔧 Troubleshooting

### Authentication Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Login redirects back to login | Cookies not set | Check `credentials: true` in `apiClient`, CORS enabled on backend |
| "Unauthorized" on API calls | Missing/invalid JWT | Re-login, verify `JWT_SECRET` is set |
| Token persists after logout | Cookie not clearing | Check cookie domain/path settings |

### Socket.IO Connection Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Socket fails to connect | Not authenticated | Ensure user logged in before chat page |
| Messages not received | Not joined room | Verify `join_chat` emits with correct `chatId` |
| Socket disconnect loop | CORS/transport issue | Check Socket.IO CORS config matches origin |

### Upload Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Image upload fails | Cloudinary credentials wrong | Verify `CLOUDINARY_*` env vars |
| Large file error | Size limit exceeded | Adjust `limits.fileSize` in multer config |

### Database Issues

```bash
# Test connection
psql $DATABASE_URL -c "\dt"

# View logs
tail -f backend/logs/app.log  # (if logging configured)
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Guidelines

- Follow existing code patterns (service layer, Redux Toolkit)
- Keep components small & focused (single responsibility)
- Add proper loading & error states
- Write clear commit messages
- Test on mobile & desktop viewports

---

## 👨‍💻 Author

**Nikunj Makwana**

- 🌐 GitHub: [@Makwana-Nikunj](https://github.com/Makwana-Nikunj)
- 💼 LinkedIn: [Nikunj Makwana](https://linkedin.com/in/nikunjmakwana)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by campus community needs
- Built with modern web technologies
- UI icons from [Lucide React](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com) / [Render](https://render.com)

---

**⭐ If you found this project helpful, please give it a star!**
