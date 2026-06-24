# 🛒 Devi Collections — MERN E-Commerce Platform

A production-grade, full-stack e-commerce store for Indian ethnic wear built with the MERN stack. Powered by Razorpay payments, Cloudinary image hosting, and Redux Toolkit state management.

---

## 🗂 Project Structure

```
E-commerce Website/
├── server/          ← Express.js + Node.js backend
└── client/          ← React + Vite + Tailwind CSS frontend
```

---

## ⚡ Prerequisites — Install These First

Before you can run this project, you **must** install Node.js.

### 1. Install Node.js
Download and install Node.js v20 LTS from: **https://nodejs.org/**
- Choose **"LTS (Recommended for most users)"**
- Run the installer and make sure to check ✅ **"Add to PATH"**
- Restart your computer after installation

Verify installation:
```bash
node --version   # should show v20.x.x
npm --version    # should show 10.x.x
```

### 2. Install nodemon (global, for development)
```bash
npm install -g nodemon
```

---

## 🔐 Environment Setup

### Server Environment Variables
Edit `server/.env` with your actual credentials:

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas — Create free cluster at https://mongodb.com/atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce

# JWT Secret — Generate a strong random string
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary — Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay — Test keys from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your_key_secret

# Your frontend URL
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Running

### Step 1 — Install dependencies

```bash
# Install server dependencies
cd "d:\E-commerce Website\server"
npm install

# Install client dependencies
cd "d:\E-commerce Website\client"
npm install
```

### Step 2 — Seed sample data (optional)
```bash
cd "d:\E-commerce Website\server"
npm run seed
```
This creates 6 sample products and 2 users:
- **Admin**: admin@deviCollections.com / admin123456
- **Customer**: priya@example.com / customer123

### Step 3 — Run development servers (in separate terminals)

**Terminal 1 — Backend API:**
```bash
cd "d:\E-commerce Website\server"
npm run dev
# Server runs at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd "d:\E-commerce Website\client"
npm run dev
# App runs at http://localhost:5173
```

Open your browser at **http://localhost:5173** 🎉

---

## 🗺 API Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + set cookie |
| POST | `/api/auth/logout` | Private | Clear auth cookie |
| GET | `/api/auth/profile` | Private | Get my profile |
| PUT | `/api/auth/profile` | Private | Update my profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List with pagination/filter/sort |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin | Create + upload images |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete + remove Cloudinary images |
| POST | `/api/products/:id/reviews` | Private | Add review |

### Orders & Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Private | Create order |
| GET | `/api/orders/mine` | Private | My order history |
| GET | `/api/orders/:id` | Private | Order detail |
| POST | `/api/orders/razorpay/create` | Private | Get Razorpay order ID |
| PUT | `/api/orders/:id/pay` | Private | Verify signature + mark paid |
| POST | `/api/orders/webhook/razorpay` | Public | Razorpay server webhook |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Metrics & analytics |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/:id/deliver` | Admin | Mark delivered |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id` | Admin | Update roles |
| DELETE | `/api/admin/users/:id` | Admin | Remove user |

---

## 🏗 Key Features

### Backend
- ✅ JWT authentication in HTTP-only cookies (XSS-safe)
- ✅ bcryptjs password hashing (12 salt rounds)
- ✅ Multer memory storage → Cloudinary buffer streaming
- ✅ Razorpay HMAC-SHA256 signature verification
- ✅ Atomic stock decrement with MongoDB `$inc` + `bulkWrite`
- ✅ Razorpay webhook listener
- ✅ Comprehensive error middleware (Mongoose + JWT errors)
- ✅ MongoDB aggregation for dashboard analytics

### Frontend
- ✅ RTK Query with fine-grained cache invalidation
- ✅ Cart persisted to `localStorage` (survives page refresh)
- ✅ Lazy-loaded route-based code splitting
- ✅ Razorpay Checkout SDK integration
- ✅ Real-time order progress tracker
- ✅ Admin dashboard with revenue chart + low-stock alerts
- ✅ Product image upload with live preview
- ✅ Password strength meter on registration
- ✅ Responsive mobile-first design

---

## ☁ Deployment Guide

### MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com
2. Add database user + whitelist IP (0.0.0.0/0 for any)
3. Copy connection string to `MONGO_URI` in `.env`

### Backend → Render
1. Push `server/` to GitHub
2. Create Web Service on https://render.com
3. Add all `.env` variables in Render dashboard
4. Start command: `node server.js`

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import on https://vercel.com
3. Framework: Vite | Build: `npm run build` | Output: `dist`
4. Add `VITE_API_URL` env var pointing to your Render URL

---

## 📁 Source File Map

```
server/
├── server.js                    ← Express app entry + route mounting
├── config/
│   ├── db.js                    ← MongoDB connection
│   └── cloudinary.js            ← Cloudinary SDK config
├── models/
│   ├── userModel.js             ← User schema + bcrypt + isAdmin virtual
│   ├── productModel.js          ← Product schema + auto-slug + reviews
│   └── orderModel.js            ← Order schema + Razorpay result
├── controllers/
│   ├── authController.js        ← Register, Login, Logout, Profile
│   ├── productController.js     ← CRUD + Cloudinary upload helper
│   ├── orderController.js       ← Order create + Razorpay flow + webhook
│   └── adminController.js       ← Dashboard aggregation + user management
├── middleware/
│   ├── authMiddleware.js        ← protect + adminOnly guards
│   ├── errorMiddleware.js       ← notFound + global error handler
│   └── uploadMiddleware.js      ← Multer memory storage config
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
└── utils/
    ├── generateToken.js          ← JWT → HTTP-only cookie
    └── seeder.js                 ← Sample data importer/destroyer

client/src/
├── app/store.js                  ← Redux Toolkit store
├── features/
│   ├── api/apiSlice.js           ← RTK Query base + credentials
│   ├── auth/authSlice.js         ← Auth state + login/register API
│   ├── cart/cartSlice.js         ← Cart state + localStorage persist
│   ├── products/productsApiSlice.js ← Product CRUD RTK Query
│   ├── orders/ordersApiSlice.js  ← Order + Razorpay RTK Query
│   └── users/usersApiSlice.js   ← Admin user + dashboard RTK Query
├── components/
│   ├── Header.jsx                ← Sticky glassmorphic nav
│   ├── Footer.jsx                ← Links + contact info
│   ├── ProductCard.jsx           ← Image + quick-add + wishlist
│   ├── Loader.jsx                ← Spinner + skeleton grid
│   ├── Message.jsx               ← Alert component (4 variants)
│   ├── CheckoutSteps.jsx         ← 3-step progress indicator
│   └── PrivateRoute.jsx          ← Auth + admin route guards
└── screens/
    ├── HomeScreen.jsx            ← Hero + catalog + pagination
    ├── ProductScreen.jsx         ← Gallery + size picker + reviews
    ├── CartScreen.jsx            ← Line items + order summary
    ├── ShippingScreen.jsx        ← Address form
    ├── PlaceOrderScreen.jsx      ← Order review + create
    ├── OrderScreen.jsx           ← Razorpay payment + tracker
    ├── LoginScreen.jsx
    ├── RegisterScreen.jsx
    ├── MyOrdersScreen.jsx
    └── admin/
        ├── AdminLayout.jsx       ← Sidebar layout
        ├── DashboardScreen.jsx   ← Metrics + charts
        ├── ProductListScreen.jsx ← Table + search
        ├── ProductEditScreen.jsx ← Form + image upload
        ├── OrderListScreen.jsx   ← All orders + deliver
        └── UserListScreen.jsx    ← Users + role management
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | Purple `#8e24aa` → `#c44ef0` |
| Accent | Gold `#f0b429` |
| Background | `#0f0a1a` (deep dark) |
| Card | `#1a1228` |
| Elevated | `#231833` |
| Border | `#2d2040` |
| Font | Inter (body) + Playfair Display (headings) |

---

Made with ❤️ for Devi Collections
