# 🛒 Shopix - Premium E-Commerce SaaS Platform

![Shopix Banner](https://via.placeholder.com/1200x400/0f172a/ffffff?text=Shopix+-+Next+Gen+E-Commerce)

**Shopix** is a high-performance, full-stack e-commerce platform built with a focus on modern UI/UX, scalable architecture, and secure transactions. Designed with a premium "Apple/Shopify" aesthetic, it features advanced product variant handling, smart caching, and seamless checkout flows.

### 🌐 Live Links
* **Live Demo (Frontend):** [Link to your Live Website](https://shopix-three.vercel.app/)
* **Live API (Backend):** [Link to your Backend API](https://shopix-cqpt.onrender.com/admin/)

---

## ✨ Key Features

* **Advanced Product Architecture:** Robust handling of product variants (color, size, storage) with dynamic pricing, MRP, and automatic discount calculations.
* **Secure Authentication:** Strict OTP-based user authentication flow ensuring high security and a frictionless login experience.
* **Smart Caching System:** Implemented Redis caching for both frontend (TanStack Query) and backend (Django `@cache_page`), dropping API response times from ~500ms to ~20ms.
* **Premium UI/UX:** Built with React, Tailwind CSS, and Material-UI (MUI). Features a custom theming engine, glassmorphism effects, mobile-first responsive design, and smooth skeleton loaders.
* **Variant-Based Wishlist & Cart:** Users can wishlist and add specific variants directly to their cart, maintaining state and preferences flawlessly.
* **Payment Gateway Integration:** Secure and reliable checkout processing powered by Stripe.
* **Modern Admin Dashboard:** Integrated `django-unfold` for a Tailwind-powered, beautiful, and highly functional admin control panel with optimized database queries (`select_related`).

## 🛠️ Tech Stack & Deployment

**Frontend:**
* React.js & React Router DOM
* Tailwind CSS (Styling & Responsive Layouts)
* Material-UI (MUI) (Custom themed components)
* TanStack Query (Frontend caching and state management)
* Axios
* **Hosted on:** [Vercel / Netlify / Firebase - YAHA LIKHO]

**Backend:**
* Python & Django
* Django REST Framework (DRF)
* PostgreSQL (Neon Serverless DB)
* Redis (API & Database Caching)
* Stripe (Payments)
* **Hosted on:** [Render / Railway / AWS - YAHA LIKHO]

## 📐 Architecture Highlights

* **DRY Principle & Backend-Driven UI:** Product variant names and dynamic attributes are formulated directly in Django Models (`@property`), keeping the React frontend clean and logic-free.
* **Database Query Optimization:** The Admin panel and public APIs utilize Django's `select_related` and `prefetch_related` to prevent N+1 query problems.
* **Scale-to-Zero Prevention:** Implemented cron-job pinging to prevent serverless Postgres (Neon DB) cold-start timeouts in the production environment.

## 🚀 Local Development Setup

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* Redis Server
* PostgreSQL

### Backend Setup
1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone [https://github.com/yourusername/shopix.git](https://github.com/yourusername/shopix.git)
   cd shopix/backend
