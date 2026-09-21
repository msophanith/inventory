# 📦 មានលាភ (Mean Leap) — Smart Inventory & POS System

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-FF5722?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, high-performance **Inventory Management & Point of Sale (POS) Progressive Web Application** designed for retail and wholesale businesses in Cambodia and internationally.

Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**, featuring real-time **Telegram Bot integration**, hardware-accelerated **mobile camera barcode scanning**, and native **dual-currency (USD / KHR)** support.

</div>

---

## ✨ Key Features

### 🛒 Point of Sale (POS)
- **Ultra-Fast Mobile Camera Scanner**: Powered by `react-barcode-scanner` and the W3C Barcode Detection API with WebAssembly (`@undecaf/zbar-wasm`) fallback. Features hardware flash/torch control and zero-latency audio beeps via Web Audio API.
- **Dynamic Cart & Quick Actions**: Search by product name, SKU, or barcode. Instant quantity editing, stock validation, and custom discounts.
- **Dual Currency Transactions**: Simultaneous live calculation and checkout in **$ USD** and **៛ KHR** based on configurable real-time exchange rates.
- **Flexible Payment Methods**: Cash, ABA KHQR, Card, or custom methods.
- **Digital & Printable Invoices**: Instant receipt modal with PDF generation (`jspdf`) supporting Khmer typography (**Suwannaphum** & **Kantumruy Pro**).

### 📦 Product & Catalog Management
- **Full Inventory Control**: Create, update, audit, and organize products with categories, shelf locations, buying prices, selling prices, and min-stock thresholds.
- **Deletion Safeguards**: High-security deletion flow requiring the operator to type the exact product name before deletion can proceed.
- **Batch Data Operations**: PostgREST batching algorithms ensuring smooth handling of large inventories without hitting API pagination limits.
- **Excel & CSV Export**: Download filtered inventory records and catalogs formatted for spreadsheet workflows.

### 🔄 Stock Movements & History
- **Complete Audit Trail**: Log stock movements (`IN` 📥, `OUT` 📤, `RETURN` 🔄) with reference notes, supplier data, and operator logging.
- **Damaged Stock Protection**: Damaged returns (`isDamaged = true`) are segregated from sellable inventory and automatically deducted from profit analytics.

### 🤖 Telegram Bot Notifications
- **Real-Time Asynchronous Alerts**: Automated HTML-formatted notifications dispatched to Telegram groups for:
  - **Single Stock Operations**: Real-time alerts when stock is received, written off, or returned.
  - **POS Orders**: Itemized sales breakdown with product quantities, discounts, grand totals (USD & KHR), payment method, and Phnom Penh timestamps (UTC+7).

### 🌐 Internationalization & Typography
- **Khmer & English Dual Support**: Instant locale switching with English in **Inter** and Khmer rendered in **Kantumruy Pro**.
- **Keyboard Shortcuts**: Built-in modal guide (<kbd>?</kbd>) for seamless, keyboard-driven navigation across POS and management screens.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & Motion** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query), [Zustand](https://zustand.docs.pmnd.rs/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row-Level Security, Storage) |
| **Table & Virtualization** | [TanStack React Table v8](https://tanstack.com/table), [TanStack React Virtual](https://tanstack.com/virtual) |
| **Scanning Engine** | [react-barcode-scanner](https://github.com/preflower/react-barcode-scanner), `@undecaf/zbar-wasm` |
| **PDF & Exports** | [jspdf](https://github.com/parallax/jsPDF), [xlsx](https://sheetjs.com/), [html2canvas](https://html2canvas.hertzen.com/) |
| **Notifications** | [goey-toast](https://github.com/), Telegram Bot API |
| **App Shell** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Service Worker, Offline Cache) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v22.0.0` or higher (configured in `.nvmrc` and `package.json`)
- **Package Manager**: `yarn` (recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/inventory.git
   cd inventory
   ```

2. **Switch to Node 22**:
   ```bash
   nvm use
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_publishable_key

# Telegram Bot Integration (Optional)
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_CHAT_ID=your_telegram_group_chat_id
```

### Running the Application

- **Start Development Server**:
  ```bash
  yarn dev
  ```
- **Typecheck & Production Build**:
  ```bash
  yarn build
  ```
- **Run Linter**:
  ```bash
  yarn lint
  ```
- **Preview Production Build**:
  ```bash
  yarn preview
  ```

---

## 📐 Project Architecture & Conventions

- **File Length Limit**: Every component and module is kept under 150 lines for high cohesion and single responsibility.
- **Dual Currency Standards**: All financial cards, tables, receipts, and reports format numbers via `formatCurrencyUsd` and `formatCurrencyKhr`.
- **Database Consistency**: All stock adjustments immediately synchronize the `Product.quantity` database state.
- **Batching Safeguards**: Supabase queries chunk operations into 1,000-row ranges to prevent silent API truncation on large datasets.

---

## 👨‍💻 Author

**Sophanith Mey**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
