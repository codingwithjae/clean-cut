# Clean Cut 💎

A professional, simple and minimalist link shortener built for developers and creators.

![Clean Cut Link Shortener](file:///home/johander/.gemini/antigravity/brain/f443bdec-41f8-45d3-9d4f-b8d4434c235f/media__1770593483653.png)

## 🚀 Overview

**Clean Cut** is a modern URL shortener with a sleek cyber-tech aesthetic. Built from scratch as a full-stack application, the project features a robust **MVC backend** and a modular **React frontend** following **Atomic Design principles**.

This project is open-source and free to fork for your own use. It includes a built-in **API Key system**, allowing you to integrate link shortening into your own projects. While registration is not required to test basic public shortening, creating an account and verifying your email (for security purposes) grants access to the full **API Key management** and a **personalized analytics dashboard**. To ensure fair use, the API includes a rate limiter of 100 requests per hour per IP address.

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
- **Icons**: React Icons (Fa, Md).

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Prisma PostgreSQL integration
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

### 3. Environment Setup

#### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory.
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/cleancut"
JWT_SECRET="your-super-secret-key"
FRONTEND_URL="http://localhost:5173"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/v1/auth/google/callback"

# SMTP Configuration (Resend)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS="re_your_api_key_here"
EMAIL_FROM="onboarding@resend.dev"
```

#### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory.
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_AUTH_URL=http://localhost:5000/api/v1/auth/google
VITE_BASE_URL=http://localhost:5000
```

### 4. Run Development
```bash
# In backend/
pnpm prisma generate
pnpm dev

# In frontend/
pnpm dev
```

---
Built with 💙 for the modern web by **Johander Campos**.
