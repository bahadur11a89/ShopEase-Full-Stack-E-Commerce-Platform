# ShopEase — Full-Stack E-Commerce Platform

ShopEase is a full-stack e-commerce web application engineered to deliver a seamless shopping experience for customers and a feature-rich administration portal for store operators. The application bridges modern web storefront functionality with a scalable RESTful backend API and database storage.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Customer Features](#customer-features)
  - [Admin Features](#admin-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Seeding](#database-seeding)
- [Environment Variables](#environment-variables)
- [Database & Models](#database--models)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Security](#security)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Troubleshooting](#troubleshooting)
- [Development Commands](#development-commands)
- [GitHub Commands](#github-commands)
- [Author](#author)
- [License](#license)

---

## Overview

**ShopEase** solves the essential challenges of online retail by providing:
1. **An intuitive storefront** where shoppers can browse product catalogs, filter by categories, search items, manage their cart, submit orders, rate products, and track purchase history.
2. **An administrative engine** empowering store managers with analytics timelines, product inventory controls, user role access, and order processing status workflows.
3. **Robust transaction security** featuring server-side stock validation with atomic decrements and rollback protection to prevent race conditions during peak checkout traffic.

---

## Features

### Customer Features

- **User Authentication**: Secure user registration, login, and profile editing.
- **Product Catalog Browsing**: Explore products with interactive grid layouts, original vs. discounted pricing, and stock status indicators.
- **Filtering & Search**: Dynamic search with regular expression matching, category filtering (Electronics, Fashion, Footwear, Accessories, Home, Beauty, Sports), and sorting options (price low-to-high, price high-to-low, highest rating, newest).
- **Product Reviews**: Submit ratings (1–5 stars) and feedback comments on purchased products.
- **Cart Management**: Real-time cart state stored in client `localStorage`, item count badges in navbar and mobile drawer, dynamic quantity updates, and cart subtotal calculation.
- **Checkout & Coupon System**: Server-validated order placement supporting promotional coupon codes (`SAVE10`, `SHOPEASE20`, `FIRST50`), automated shipping fee calculations, and Cash on Delivery (COD) payment method.
- **Order History**: Personal user dashboard displaying order statuses, item breakdowns, delivery addresses, and purchase timestamps.
- **Responsive Layout**: Mobile navigation drawer with hamburger menu and overlay for mobile, tablet, and desktop viewports.

### Admin Features

- **Admin Authentication**: Protected administrative interface restricted strictly to accounts with the `admin` role.
- **Dashboard Overview**: Metrics displaying total products, orders, users, revenue summaries, pending order counts, and low-stock alerts.
- **Sales Analytics**: Interactive charts and data metrics showing revenue timelines over customizable timeframes (7 days, 30 days, current month) and order status breakdown counts.
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete) for product items, including featured toggles and stock updates.
- **Order Management**: Comprehensive view of all system orders with search by customer name/email/ID, status filter, pagination, and real-time status updating (Pending, Processing, Shipped, Delivered, Cancelled).
- **User Management**: View registered system users, search users by name or email, filter by user role, and remove customer accounts (admin accounts are protected from accidental deletion).
- **Inventory Control**: Real-time stock tracking with automated low-stock warnings when inventory drops below threshold limits ($stock \le 10$).
- **Live Activity Stream**: Real-time audit log of recent orders, user registrations, and inventory alerts.

---

## Tech Stack

### Frontend
- **HTML5 & CSS3**: Custom responsive grid layout, flexbox, CSS variables, dark-themed UI components, and micro-animations.
- **JavaScript (ES6+)**: Modular client-side script handling fetch API calls, DOM manipulations, state persistence, and authentication headers.
- **Iconography & Fonts**: Google Fonts (Inter, Outfit) and FontAwesome icon sets.
- **Tooling / Static Server**: `live-server` and `http-server` for standalone development.

### Backend
- **Node.js & Express.js**: Asynchronous RESTful API web server with custom routing and middleware chains.
- **MongoDB & Mongoose**: NoSQL document database with strict schema definitions, validations, static query methods, and middleware hooks.
- **Authentication**: `jsonwebtoken` (JWT) for stateless bearer authorization and `bcryptjs` for salt-hashed password storage.
- **Utilities**: `dotenv` for environment isolation and `cors` for cross-origin request handling.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────────────────┐    ┌───────────────────────┐  │
│  │    Customer Frontend     │    │      Admin Panel      │  │
│  │ (HTML5 / Vanilla JS / CSS)│    │ (HTML5 / JS Dashboard)│  │
│  └─────────────┬────────────┘    └───────────┬───────────┘  │
└────────────────┼─────────────────────────────┼──────────────┘
                 │ HTTP Requests (JSON / Auth) │
                 ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                          │
│                   Express.js REST API                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Middleware: CORS, express.json(), JWT Auth, AdminOnly │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────┴───────────────────────────┐  │
│  │ Routes & Controllers:                                 │  │
│  │ /api/auth, /api/products, /api/orders, /api/users,    │  │
│  │ /api/cart, /api/admin                                 │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ Mongoose Queries
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                          │
│                        MongoDB                              │
│       ┌───────────────┬────────────────┬──────────────┐     │
│       │ Users Schema  │ Product Schema │ Order Schema │     │
│       └───────────────┴────────────────┴──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
ShopEase/
├── backend/
│   ├── config/             # Database connection configuration
│   ├── controllers/        # Request processing & business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/         # Auth & access control middleware
│   │   └── authMiddleware.js
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── public/             # Fallback static assets
│   ├── routes/             # Express API router modules
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env                # Local backend environment configuration
│   ├── package.json        # Backend dependencies & npm scripts
│   ├── seedAdmin.js        # Script to seed default administrator & demo user
│   └── server.js           # Main Express server entrypoint & HTML static server
├── frontend/
│   ├── css/
│   │   └── style.css       # Unified CSS design system & page layouts
│   ├── images/             # Static product & brand media
│   ├── js/
│   │   └── app.js          # Cart, Auth state, API helpers, & drawer logic
│   ├── pages/              # HTML application view templates
│   │   ├── 404.html
│   │   ├── about.html
│   │   ├── admin.html
│   │   ├── cart.html
│   │   ├── contact.html
│   │   ├── gallery.html
│   │   ├── login.html
│   │   ├── profile.html
│   │   ├── register.html
│   │   ├── services.html
│   │   └── shop.html
│   ├── index.html          # Main storefront landing page
│   └── package.json        # Frontend development server scripts
├── .env.example            # Environment variables blueprint
├── .gitignore              # Repository git ignore rules
├── LICENSE                 # MIT License file
├── package.json            # Root process runner configuration
└── README.md               # Project documentation
```

---

## Installation

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://localhost:27017` or a MongoDB Atlas Cloud URI)

### Backend Setup

1. Open a terminal and navigate to the project directory:
   ```bash
   git clone https://github.com/bahadur11a89/ShopEase.git
   cd ShopEase
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create your `.env` file inside the `backend` folder (or copy from `.env.example`):
   ```ini
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/shopease
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Seed default admin and user accounts into MongoDB:
   ```bash
   npm run seed:admin
   ```
   *Default Credentials Created:*
   - **Admin Account**: `admin@shopease.com` / `password123`
   - **Demo User Account**: `user@shopease.com` / `password123`

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will launch on `http://localhost:3000`.

### Frontend Setup

The backend server automatically serves the frontend static files at `http://localhost:3000`. 

Alternatively, if you wish to run the frontend standalone with live reload:

1. Open a separate terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend live server:
   ```bash
   npm run dev
   ```
   The standalone frontend server will run on `http://localhost:5000`.

### Database Seeding

To populate the catalog with sample products across all categories (Electronics, Fashion, Footwear, Accessories, Home, Beauty, Sports):
- Open your browser or send an HTTP GET request to:
  `http://localhost:3000/api/products/seed`

---

## Environment Variables

The project uses environment variables for security and operational configuration. Never commit real credentials to version control. Refer to [.env.example](file:///.env.example) for variable definitions.

| Variable Name | Required | Default Value | Purpose |
|---|---|---|---|
| `PORT` | Optional | `3000` | Port number on which Express server listens |
| `MONGO_URI` | Required | `mongodb://localhost:27017/shopease` | Connection string for MongoDB database |
| `JWT_SECRET` | Required | `your_jwt_secret_key_here` | Secret key used to sign and verify JWT tokens |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` / `production`) |

---

## Database & Models

### 1. User Model (`User.js`)
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `password` (String, required, hashed with bcrypt)
- `role` (String, enum: `['user', 'admin']`, default: `'user'`)
- `phone` (String)
- `address` (String)
- `createdAt` (Date, default: `Date.now`)

### 2. Product Model (`Product.js`)
- `name` (String, required)
- `description` (String, required)
- `price` (Number, required)
- `originalPrice` (Number)
- `category` (String, enum: `['Electronics', 'Fashion', 'Footwear', 'Accessories', 'Home', 'Beauty', 'Sports']`)
- `image` (String, required)
- `stock` (Number, default: `10`)
- `rating` (Number, default: `0`)
- `numReviews` (Number, default: `0`)
- `reviews` (Array of sub-documents: `user`, `name`, `rating`, `comment`, `createdAt`)
- `featured` (Boolean, default: `false`)
- `createdAt` (Date, default: `Date.now`)

### 3. Order Model (`Order.js`)
- `user` (ObjectId, ref: `'User'`, required)
- `items` (Array of items: `product`, `name`, `image`, `price`, `qty`)
- `shippingAddress` (Object: `name`, `phone`, `address`, `city`, `pincode`)
- `paymentMethod` (String, default: `'COD'`)
- `totalPrice` (Number, required)
- `isPaid` (Boolean, default: `false`)
- `isDelivered` (Boolean, default: `false`)
- `status` (String, enum: `['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']`, default: `'Pending'`)
- `createdAt` (Date, default: `Date.now`)

---

## API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Purpose | Authorization |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | None |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT token | None |
| `GET` | `/api/auth/profile` | Retrieve logged-in user profile details | Protected (User) |
| `PUT` | `/api/auth/profile` | Update account details & optional password change | Protected (User) |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Purpose | Authorization |
|---|---|---|---|
| `GET` | `/api/products` | Fetch paginated products with search, filter, and sort | None |
| `GET` | `/api/products/featured` | Fetch featured products for homepage showcase | None |
| `GET` | `/api/products/seed` | Seed database with sample product catalog | None |
| `GET` | `/api/products/:id` | Get detailed information for a single product | None |
| `POST` | `/api/products` | Create a new product entry | Protected (Admin) |
| `PUT` | `/api/products/:id` | Modify existing product details or stock | Protected (Admin) |
| `DELETE` | `/api/products/:id` | Remove a product from inventory | Protected (Admin) |
| `POST` | `/api/products/:id/review` | Submit a customer rating and review | Protected (User) |

### Cart Endpoints (`/api/cart`)

| Method | Endpoint | Purpose | Authorization |
|---|---|---|---|
| `POST` | `/api/cart/validate` | Validate cart items & calculate subtotal server-side | None |

### Order Endpoints (`/api/orders`)

| Method | Endpoint | Purpose | Authorization |
|---|---|---|---|
| `POST` | `/api/orders` | Submit new order with stock reservation & coupon calculation | Protected (User) |
| `GET` | `/api/orders/myorders` | Retrieve purchase history for the logged-in user | Protected (User) |
| `GET` | `/api/orders/all` | Retrieve all orders with search, status filter, and pagination | Protected (Admin) |
| `GET` | `/api/orders/stats` | Retrieve total order count and aggregate revenue | Protected (Admin) |
| `PUT` | `/api/orders/:id/status` | Update order processing status | Protected (Admin) |

### User Management Endpoints (`/api/users`)

| Method | Endpoint | Purpose | Authorization |
|---|---|---|---|
| `GET` | `/api/users` | List registered accounts with search, role filter, & pagination | Protected (Admin) |
| `DELETE` | `/api/users/:id` | Delete a customer account (admin accounts protected) | Protected (Admin) |

### Admin Analytics & Monitoring Endpoints (`/api/admin`)

| Method | Endpoint | Purpose | Authorization |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Retrieve high-level store stats (products, orders, users, revenue) | Protected (Admin) |
| `GET` | `/api/admin/analytics` | Retrieve revenue timeline & status map breakdown | Protected (Admin) |
| `GET` | `/api/admin/low-stock` | Retrieve products with low inventory ($stock \le 10$) | Protected (Admin) |
| `GET` | `/api/admin/activity` | Retrieve unified audit activity stream | Protected (Admin) |

---

## Authentication & Authorization

- **Password Security**: Passwords are automatically hashed prior to document insertion using a Mongoose pre-save hook with `bcryptjs` (salt factor 10).
- **JWT Issuance**: Upon successful login or registration, the backend signs a JSON Web Token containing the user's MongoDB `_id`, configured with a 7-day expiration time.
- **Route Guarding**:
  - The `protect` middleware verifies incoming `Authorization: Bearer <token>` HTTP headers.
  - The `adminOnly` middleware checks if `req.user.role === 'admin'`, returning a `403 Forbidden` status code for non-admin accounts.

---

## Security

- **Environment Isolation**: Database credentials and secret keys are managed through `.env` files and excluded from repository commits via [.gitignore](file:///.gitignore).
- **Sanitized Search**: Input search parameters are escaped using regular expression sanitization (`replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) to protect against ReDoS or query injection vulnerabilities.
- **Concurrency & Stock Integrity**: Orders undergo atomic stock validation and conditional rollback via `findOneAndUpdate({ _id, stock: { $gte: qty } })`, eliminating overselling during simultaneous purchases.
- **Protected Password Hashes**: User queries default to excluding password fields (`select('-password')`).
- **Safety Overrides**: Admin deletion endpoints explicitly block attempts to remove accounts with `role === 'admin'`.

---

## Deployment

### Backend Deployment (e.g., Render / Railway)
1. Push your repository to GitHub.
2. Connect your repository to Render / Railway.
3. Set Build Command: `cd backend && npm install`
4. Set Start Command: `node backend/server.js`
5. Configure Environment Variables in the cloud dashboard:
   - `PORT`: `3000` (or host assigned)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/shopease`
   - `JWT_SECRET`: `<your_secure_production_secret>`

### Database Deployment (MongoDB Atlas)
1. Create a MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User and whitelist your deployment IP addresses (`0.0.0.0/0` for cloud hosts).
3. Copy the MongoDB connection string into your backend deployment environment settings (`MONGO_URI`).

---

## Screenshots

*(Add project screenshots here)*

### Home Page
![Home Page Placeholder](https://via.placeholder.com/800x450?text=ShopEase+Home+Page)

### Product Page
![Product Page Placeholder](https://via.placeholder.com/800x450?text=ShopEase+Product+Page)

### Cart
![Cart Page Placeholder](https://via.placeholder.com/800x450?text=ShopEase+Cart)

### Admin Dashboard
![Admin Dashboard Placeholder](https://via.placeholder.com/800x450?text=ShopEase+Admin+Dashboard)

---

## Future Improvements

- **Payment Gateway**: Integration with Stripe and Razorpay SDKs for online credit card and UPI transactions.
- **Wishlist Support**: Customer wishlist and saved-for-later items.
- **Email & SMS Notifications**: Automated transactional emails (Nodemailer / SendGrid) upon order placement and dispatch.
- **Redis Caching**: Caching high-frequency catalog queries to reduce database load.
- **CI/CD Workflows**: GitHub Actions pipeline for automated syntax linting, building, and deployment tests.
- **Automated Testing**: Integration test suite using Jest and Supertest.

---

## Troubleshooting

### 1. MongoDB Connection Failure
- **Symptom**: `⚠️ MongoDB not connected: connect ECONNREFUSED 127.0.0.1:27017`
- **Solution**: Ensure your local MongoDB service is running (`net start MongoDB` on Windows) or check that `MONGO_URI` in `.env` contains valid credentials.

### 2. Unauthorized (401) Errors
- **Symptom**: `Not authorized, no token` or `Token invalid`
- **Solution**: Clear browser local storage and re-login to obtain a fresh JWT token.

### 3. Port Occupied
- **Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`
- **Solution**: Change the `PORT` variable in `backend/.env` to an open port (e.g., `PORT=3001`).

---

## Development Commands

### Root Commands (`/package.json`)
```bash
npm start       # Launches backend server
npm run dev     # Launches backend server with nodemon
npm run seed:admin # Seeds default administrator and demo user
```

### Backend Commands (`/backend/package.json`)
```bash
npm start       # Starts backend node server
npm run dev     # Starts backend nodemon development server
npm run seed    # Triggers product seed endpoint
npm run seed:admin # Seeds administrator user into MongoDB
```

### Frontend Commands (`/frontend/package.json`)
```bash
npm start       # Starts frontend with http-server on port 5000
npm run dev     # Starts frontend with live-server on port 5000
```

---

## GitHub Commands

Follow these steps to commit and push your changes to GitHub:

```bash
# Check repository status
git status

# Stage all updated and created files
git add .

# Commit changes with structured commit message
git commit -m "docs: add professional README, license, gitignore and env template"

# Push to primary main branch
git push origin main
```

---

## Author

**Raj Bahadur**  
- **GitHub**: [https://github.com/bahadur11a89](https://github.com/bahadur11a89)

---

## License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/ShopEase/LICENSE) file for full details.
