<p align="center">
  <img src="https://github.com/user-attachments/assets/f3f08ba9-a587-4a6d-88f8-d461ceac5af5" alt="Aus Lanka Logo" width="250"/>
</p>

<h1 align="center">Ausi Lanka E-Commerce Platform</h1>
<h3 align="center">Full-Stack Australian Product Price Comparison & Delivery System</h3>

<div align="center">
  
[![Live Business](https://img.shields.io/badge/Status-LIVE-brightgreen)](https://auslanka.com.au)  
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)  
[![PostgreSQL](https://img.shields.io/badge/Neon%20DB-PostgreSQL%2015-blue.svg)](https://neon.tech)  
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://www.mongodb.com/)  
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About

**Ausi Lanka** is a production-ready e-commerce platform serving the Sri Lankan community in Australia. The platform features real-time product price scraping from major Australian retailers (Woolworths, Coles, Officeworks, Aldi, Chemist Warehouse), currency conversion (AUD to LKR), and a complete online ordering system with Christmas-themed UI.

### Business Metrics (2025)

- 🛒 **5,000+ active customers**
- 🏪 **200+ verified suppliers**
- 🚚 **15,000+ successful deliveries**
- ⭐ **98.7% customer satisfaction**
- 🇦🇺 **Operating in 8 major Australian cities**

---

## ✨ Key Features

### 🛍️ E-Commerce Core

- **Product Catalog** with advanced filtering and search
- **Shopping Cart** with persistent state management (Zustand)
- **Checkout System** with order confirmation emails (Resend)
- **Order History** tracking with detailed status updates
- **User Profiles** with address management

### 💰 Price Intelligence

- **Multi-Retailer Scraping** from 5 major Australian stores
- **Real-Time Currency Conversion** (AUD → LKR with live exchange rates)
- **Price Comparison** across retailers with calculated shipping costs
- **Dynamic Pricing** based on product categories and weight

### 🎨 UI/UX

- **Christmas Theme** with animated snow effects (50 particles)
- **Product Carousel** with thumbnail navigation
- **Responsive Design** (mobile-first Tailwind CSS)
- **Dark Mode** support with theme persistence
- **Loading States** and skeleton screens

### 👨‍💼 Admin Dashboard

- **Analytics Overview** with sales charts
- **Product Management** (CRUD operations)
- **Order Management** with status updates
- **User Management** with role-based access
- **Inventory Tracking** with low-stock alerts
- **Shipment Tracking** integration

### 🤖 Web Scraping Engine (TypeScript)

- **Puppeteer-Based** scraping with anti-bot detection bypass
- **Cluster Support** for Aldi scraping (parallel processing)
- **Error Handling** with detailed logging
- **Retry Logic** with exponential backoff
- **Image Extraction** with URL validation
- **Schema Detection** for structured data

---

## 🛠️ Tech Stack

### Frontend (`/client`)

| Technology        | Version | Purpose                           |
| ----------------- | ------- | --------------------------------- |
| **Next.js**       | 15.x    | React framework with App Router   |
| **TypeScript**    | 5.x     | Type-safe development             |
| **Tailwind CSS**  | 3.x     | Utility-first styling             |
| **tRPC**          | 11.x    | End-to-end typesafe APIs          |
| **Drizzle ORM**   | Latest  | Type-safe PostgreSQL queries      |
| **Zustand**       | 5.x     | State management (cart, language) |
| **Framer Motion** | 11.x    | Animations (carousel, snow)       |
| **Clerk**         | 6.x     | Authentication & user management  |
| **Resend**        | 4.x     | Transactional emails              |

### Backend (`/server`)

| Technology            | Version | Purpose                      |
| --------------------- | ------- | ---------------------------- |
| **Node.js**           | 20.x    | JavaScript runtime           |
| **TypeScript**        | 5.7     | Type-safe backend code       |
| **Express.js**        | 5.x     | Web framework                |
| **Puppeteer**         | 24.x    | Web scraping automation      |
| **puppeteer-cluster** | 0.24.x  | Parallel scraping            |
| **Mongoose**          | 8.x     | MongoDB ODM (exchange rates) |
| **Axios**             | 1.7.x   | HTTP client                  |
| **dotenv**            | 16.x    | Environment configuration    |
| **tsx**               | 4.x     | TypeScript execution         |

### Databases

- **PostgreSQL** (Neon) - Main application data (products, orders, users)
- **MongoDB** - Exchange rates and scraping cache

### Infrastructure

- **Vercel** - Frontend hosting (Next.js)
- **AWS EC2** - Backend API server (t3.xlarge)
- **Bun** - Fast package manager & runtime

---

## 📁 Project Structure

```
ausi-lanka-ecom/
├── client/                    # Next.js frontend application
│   ├── app/                   # Next.js 15 App Router
│   │   ├── (admin)/          # Admin dashboard routes
│   │   ├── (auth)/           # Authentication pages (sign-in/sign-up)
│   │   ├── (process)/        # Main app routes (cart, catalog, checkout, etc.)
│   │   ├── api/              # API routes (tRPC, webhooks)
│   │   ├── layout.tsx        # Root layout with ChristmasSnow
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── admin/            # Admin dashboard components
│   │   ├── cart/             # Shopping cart UI
│   │   ├── catalog/          # Product catalog
│   │   ├── checkout-section/ # Checkout flow
│   │   ├── home/             # Landing page sections
│   │   │   ├── christmas-advertisement.tsx  # Christmas carousel
│   │   │   ├── business-advertisement.tsx    # Regular carousel
│   │   │   └── navbar.tsx    # Navigation
│   │   ├── christmas-snow.tsx  # Global snow animation
│   │   └── server/           # Server components
│   ├── db/                   # Database schema & config
│   │   ├── index.ts          # Neon PostgreSQL connection
│   │   └── schema.ts         # Drizzle ORM schemas
│   ├── trpc/                 # tRPC setup
│   │   ├── routers/          # API route definitions
│   │   ├── client.tsx        # Client-side tRPC
│   │   └── server.tsx        # Server-side tRPC
│   ├── store/                # Zustand state stores
│   │   ├── useCartStore.ts   # Shopping cart state
│   │   └── useLanguageStore.ts  # Language preference
│   ├── public/assets/        # Static assets (product images)
│   ├── middleware.ts         # Clerk auth middleware
│   ├── drizzle.config.ts     # Drizzle ORM config
│   └── package.json          # Dependencies (Bun)
│
├── server/                   # TypeScript backend (Express API)
│   ├── controller/           # Request handlers
│   │   ├── scrapeController.ts      # Chemist Warehouse scraper
│   │   ├── colesController.ts       # Coles scraper
│   │   ├── woolworthsController.ts  # Woolworths scraper
│   │   ├── officeworksController.ts # Officeworks scraper
│   │   └── aldiContoller.ts         # Aldi scraper (cluster-based)
│   ├── routes/               # Express route definitions
│   │   ├── scrapeRoutes.ts
│   │   ├── colesRoutes.ts
│   │   ├── woolworthsRoutes.ts
│   │   ├── officeworksRoutes.ts
│   │   └── adliRoutes.ts
│   ├── models/               # Mongoose models
│   │   └── exchangeRate.ts   # AUD/LKR exchange rate schema
│   ├── calculator/           # Business logic
│   │   └── calculator.ts     # Price calculation with multipliers
│   ├── index.ts              # Express server entry point
│   ├── tsconfig.json         # TypeScript config (ES2020, DOM lib)
│   └── package.json          # Dependencies (Bun)
│
├── README.md                 # This file
└── LICENSE                   # MIT License with restrictions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **Bun** 1.x (package manager)
- **PostgreSQL** (Neon account recommended)
- **MongoDB** (local or Atlas)
- **Chrome/Chromium** (for Puppeteer scraping)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SashenJayathilaka/ausi-lanka-ecom.git
cd ausi-lanka-ecom
```

2. **Install dependencies**

```bash
# Install client dependencies
cd client
bun install

# Install server dependencies
cd ../server
bun install
```

3. **Set up environment variables**

Create `.env` files in both `client/` and `server/` directories:

**`client/.env`**

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/catalog
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/catalog

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Resend (Email)
RESEND_API_KEY=re_...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**`server/.env`**

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/auslanka
# or MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/auslanka

# Chrome Path (for Puppeteer)
# Windows
CHROME_PATH=C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe
# macOS
# CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# Linux
# CHROME_PATH=/usr/bin/google-chrome

# Server Port
PORT=5000

# CORS Origins
CORS_ORIGIN=http://localhost:3000
```

4. **Set up the database**

```bash
cd client
bun run drizzle-kit push  # Push schema to Neon DB
```

5. **Start development servers**

Open two terminals:

**Terminal 1 (Frontend):**

```bash
cd client
bun run dev
# Runs on http://localhost:3000
```

**Terminal 2 (Backend):**

```bash
cd server
bun run dev
# Runs on http://localhost:5000
```

---

## 💻 Development

### Available Scripts

#### Client (`/client`)

```bash
bun run dev          # Start Next.js dev server (port 3000)
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:studio    # Open Drizzle Studio (database GUI)
bun run db:push      # Push schema changes to database
```

#### Server (`/server`)

```bash
bun run dev          # Start with tsx watch (hot reload)
bun run build        # Compile TypeScript to JavaScript
bun run start        # Run compiled JavaScript (production)
```

### Code Style & Formatting

- **TypeScript** for type safety across both client and server
- **ESLint** for code quality
- **Prettier** (recommended) for consistent formatting
- **Strict mode** enabled in `tsconfig.json`

### TypeScript Migration

The server codebase was recently migrated from JavaScript to TypeScript:

- ✅ All controllers converted with full type safety
- ✅ Express Request/Response types
- ✅ Puppeteer Browser/Page types
- ✅ Custom interfaces for scrape results
- ✅ Error handling with proper type casting
- ✅ DOM lib included for `page.evaluate()` calls

---

## 🔑 Environment Variables

### Client Environment Variables

| Variable                            | Description                       | Required |
| ----------------------------------- | --------------------------------- | -------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key                  | ✅       |
| `CLERK_SECRET_KEY`                  | Clerk secret key                  | ✅       |
| `DATABASE_URL`                      | Neon PostgreSQL connection string | ✅       |
| `RESEND_API_KEY`                    | Resend email API key              | ✅       |
| `NEXT_PUBLIC_API_URL`               | Backend API URL                   | ✅       |

### Server Environment Variables

| Variable      | Description                        | Required      |
| ------------- | ---------------------------------- | ------------- |
| `MONGODB_URI` | MongoDB connection string          | ✅            |
| `CHROME_PATH` | Path to Chrome/Chromium executable | ⚠️ Optional\* |
| `PORT`        | Server port (default: 5000)        | ❌            |
| `CORS_ORIGIN` | Allowed CORS origins               | ❌            |

\* If `CHROME_PATH` is not set, Puppeteer will download and use Chromium.

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000
Production: https://api.auslanka.com.au (if deployed)
```

### Scraping Endpoints

#### 1. Scrape Chemist Warehouse Product

```http
GET /api/scrape?url={PRODUCT_URL}&rate={EXCHANGE_RATE}
```

**Example:**

```bash
curl "http://localhost:5000/api/scrape?url=https://www.chemistwarehouse.com.au/buy/123456/product-name&rate=185.50"
```

**Response:**

```json
{
  "results": [
    {
      "url": "https://www.chemistwarehouse.com.au/...",
      "title": "Product Name 500ml",
      "price": "$12.99",
      "image": "https://www.chemistwarehouse.com.au/images/...",
      "calculatedPrice": "Rs 2,409.00",
      "success": true
    }
  ],
  "total": 1,
  "successful": 1,
  "failed": 0
}
```

#### 2. Scrape Coles Product

```http
GET /api/coles?url={PRODUCT_URL}&rate={EXCHANGE_RATE}
```

#### 3. Scrape Woolworths Product

```http
GET /api/woolworths?url={PRODUCT_URL}&rate={EXCHANGE_RATE}
```

#### 4. Scrape Officeworks Product

```http
GET /api/officeworks?url={PRODUCT_URL}&rate={EXCHANGE_RATE}
```

#### 5. Scrape Aldi Product (Cluster-based)

```http
GET /api/aldi?url={PRODUCT_URL}&rate={EXCHANGE_RATE}
```

### Response Format

All scraping endpoints return the same structure:

```typescript
interface ScrapeResponse {
  results: Array<{
    url: string;
    title?: string;
    price?: string;
    image?: string;
    calculatedPrice?: string;
    retailer?: string;
    success: boolean;
    error?: string;
  }>;
  total: number;
  successful: number;
  failed: number;
}
```

### Error Responses

```json
{
  "error": "Browser initialization failed.",
  "details": "Chrome executable not found...",
  "suggestion": "Check if Chrome is installed and CHROME_PATH is set correctly"
}
```

---

## 🚢 Deployment

### Frontend (Vercel)

1. **Connect GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy**: Vercel auto-deploys on push to `main`

```bash
# Manual deployment
cd client
bun run build
vercel --prod
```

### Backend (AWS EC2)

1. **Launch EC2 instance** (Ubuntu 22.04, t3.xlarge)
2. **Install dependencies**:

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

3. **Clone and build**:

```bash
git clone https://github.com/SashenJayathilaka/ausi-lanka-ecom.git
cd ausi-lanka-ecom/server
bun install
bun run build
```

4. **Set up PM2** (process manager):

```bash
npm install -g pm2
pm2 start dist/index.js --name "auslanka-api"
pm2 startup
pm2 save
```

5. **Configure Nginx** (reverse proxy):

```nginx
server {
    listen 80;
    server_name api.auslanka.com.au;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Guidelines

- Write **type-safe TypeScript** code
- Follow existing **code structure** and naming conventions
- Add **comments** for complex logic
- Test scraping functions with **real URLs**
- Update **documentation** for new features

---

## 📜 License

This project is licensed under the **MIT License with Commercial Restrictions**.

⚠️ **Commercial Use Restrictions:**

- Unauthorized commercial use, replication, resale, or redistribution is **strictly prohibited**
- Written permission required for any commercial usage
- This repository is public for operational deployment purposes only

© 2025 Ausi Lanka. All rights reserved.

See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

### Business Inquiries

**Head Office:**  
95 Weeden Drive, Vermont South 3133, VIC, Australia

**Business Hours:**  
Monday – Friday: 9:00 AM – 5:00 PM AEST

### Contact Channels

- 📧 **Orders:** [ausilk27@gmail.com](mailto:ausilk27@gmail.com)
- 🤝 **Partnerships:** [ausilk27@gmail.com](mailto:ausilk27@gmail.com)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/SashenJayathilaka/ausi-lanka-ecom/issues)
- ☎️ **Customer Support:** +94 77 675 3242

### Social Media

- 👍 [Facebook: Ausilk](https://www.facebook.com/people/Ausilk/61555664871422/?_rdr)
- 🌐 [Website: auslanka.com.au](https://auslanka.com.au)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Seamless deployment platform
- **Neon** - Serverless PostgreSQL
- **Clerk** - Authentication solution
- **Puppeteer Team** - Web scraping automation

---

<p align="center">
  <strong>Built with ❤️ for the Sri Lankan community in Australia</strong><br>
  <em>"Bringing the taste of home to every Sri Lankan in Australia"</em> 🇱🇰❤️🇦🇺
</p>

<p align="center">
  <sub>Last Updated: December 2025 | Version 2.0 (TypeScript Migration)</sub>
</p>
