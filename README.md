# 📦 Smart Inventory & POS Management System

A modern, full-featured **Inventory Management & Point of Sale (POS) Web Application** built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **Telegram Bot Integration**.

---

## ✨ Features

### 📊 Dashboard & Analytics
- **Live Inventory Metrics**: Real-time total product count, overall stock value, low stock count, and out-of-stock item count.
- **Stock Alert Section**: High-priority lists for top 10 Out of Stock & Low Stock items with threshold badges and quick management links.
- **Today's Sales Summary**: Real-time tracking of total revenue, order count, and items sold today.
- **System Status Indicator**: Live system health pill with animated status badge.

### 📦 Product Management
- **Complete Product Control**: Add, edit, view details, and delete products with image previews, category filters, and search.
- **Stock Threshold Tracking**: Automatic low stock alerts when product quantities fall below custom minimum thresholds.
- **Product Details Audit**: Detailed specifications, audit history of stock movements, category, buy/sell prices, shelf locations, and timestamps.

### 🛒 Point of Sale (POS) / Checkout
- **Interactive Cart & Quick Checkout**: Add items to cart with barcode or search, adjust quantities, and select payment methods (Cash, ABA KHQR, Card, etc.).
- **Automatic Stock Adjustments**: Automatically deducts stock upon checkout completion and records transaction logs.
- **Receipt Modal & Printing**: Generate detailed sale receipt modal with print functionality.

### 🔄 Stock Movement Logs & Reports
- **Complete Audit Trail**: Log stock movements (`IN` 📥, `OUT` 📤, `RETURN` 🔄) with damage tracking and reference notes.
- **Monthly Sales & Margin Reports**: Product-level breakdown, profit margin percentages, damage losses, and order metrics.
- **Data Export**: Export executive summaries, product breakdowns, and transaction logs to **Excel (.xlsx)** or **CSV**.

### 🤖 Telegram Bot Notifications
- **Real-Time Group Alerts**: Automatically sends HTML-formatted messages to a Telegram group on:
  - **Stock Movements**: Single stock `IN`, `OUT`, `RETURN` notifications with product details, quantity, prices, and totals.
  - **POS Sales**: Itemized POS sale summaries listing all sold items, quantities, subtotal, discount, tax, grand total, payment method, and Phnom Penh timestamps (UTC+7).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS
- **Database & Backend**: Supabase (PostgreSQL)
- **State & Data Fetching**: TanStack React Query (v5)
- **UI Components & Icons**: Lucide React, Date-fns
- **Integrations**: Telegram Bot API, XLSX (SheetJS)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/inventory.git

# Navigate to project folder
cd inventory

# Install dependencies
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Telegram Bot Integration (Optional)
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_CHAT_ID=your_telegram_group_chat_id
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🌐 Vercel Deployment

1. Import the repository in [Vercel](https://vercel.com).
2. Set Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_TELEGRAM_BOT_TOKEN`, `VITE_TELEGRAM_CHAT_ID`).
3. Deploy! Client-side routes are pre-configured via `vercel.json`.

---

## 👨‍💻 Author

**Sophanith Mey**

## 📄 License

MIT License
