# Clean Cut 💎

A professional, simple, open source and minimalist link shortener built for developers and creators.

## 🚀 Overview

**Clean Cut** is a modern URL shortener with a sleek cyber-tech aesthetic. Built from scratch as a full-stack application, the project features a robust **MVC backend** and a modular **React frontend** following **Atomic Design principles**.

This project is open-source and free to fork for your own use. It includes a built-in **API Key system**, allowing you to integrate link shortening into your own projects. While registration is not required to test basic public shortening, creating an account and verifying your email (for security purposes) grants access to the full **API Key management** and a **personalized analytics dashboard**. To ensure fair use, the API includes a rate limiter of 100 requests per 10 minutes per IP address.

## 🛠️ Technology Stack

### Backend
- **Core**: Node.js, TypeScript, Express.
- **Database**: PostgreSQL with Prisma ORM.
- **Security**: Argon2, JWT, Passport.js (Google OAuth2).
- **Communication**: Nodemailer (Resend SMTP).
- **Verification**: Zod for runtime validation and Vitest for E2E testing.

### Frontend
- **Core**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS v4 (Vanilla CSS variables).
- **Animations**: Framer Motion.
- **Icons**: React Icons.

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- You can find examples of .env files in the backend and frontend directories.
- PostgreSQL database
- Resend API Key (for email verification)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd link-shortener

# Install dependencies
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 3. Run Development
```bash
# In backend/
pnpm prisma generate
pnpm dev

# In frontend/
pnpm dev
```

---
Built with 💙 for the modern web by **Johander Campos**.
