# Voltax LibertePay Demo (Next.js)

A demo application showcasing LibertePay integration using the [Voltax SDK](https://github.com/noelzappy/voltax).

![Demo Preview](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)

## Features

- 💳 LibertePay payment initiation
- ✅ Payment verification
- 🎨 Modern glassmorphism UI
- 🔒 Server-side API keys (secure)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your LibertePay credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
LIBERTEPAY_SECRET_KEY=your_libertepay_secret_key_here
LIBERTEPAY_TEST_ENV=true
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/app/
├── api/
│   ├── create-payment/route.ts   # Initiate payment
│   ├── verify-payment/route.ts   # Verify payment status
│   └── webhook/route.ts          # Handle LibertePay webhooks
├── success/page.tsx              # Payment result page
├── page.tsx                      # Main payment form
├── page.module.css               # Component styles
├── globals.css                   # Global styles
└── layout.tsx                    # Root layout
```

## How It Works

1. User fills in the payment form on the main page
2. Form submits to `/api/create-payment` which uses Voltax SDK
3. User is redirected to LibertePay checkout
4. After payment, user returns to `/success` page
5. Success page verifies the payment via `/api/verify-payment`

## Voltax SDK Usage

```typescript
import { Voltax, Currency } from '@noelzappy/voltax';

// Initialize the provider
const libertepay = Voltax('libertepay', {
  secretKey: process.env.LIBERTEPAY_SECRET_KEY!,
  testEnv: true,
});

// Initiate a payment
const payment = await libertepay.initiatePayment({
  amount: 100,
  email: 'customer@example.com',
  currency: Currency.GHS,
  reference: 'unique-ref-123',
});

// Redirect to payment
window.location.href = payment.authorizationUrl;
```

## Learn More

- [Voltax Documentation](https://voltax.noelzappy.dev)
- [LibertePay API Docs](https://libertepay.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
