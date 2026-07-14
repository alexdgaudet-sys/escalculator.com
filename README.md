# Surplus Lines Tax Calculator — SaaS Website

A modern, professional SaaS website for the Surplus Lines Tax Calculator. Includes landing page, authentication, and dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- A Supabase account (free tier works)
- A Stripe account (free tier works for testing)

### Local Development

1. **Clone and setup:**
```bash
cd saas-website
npm install
```

2. **Configure environment:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your actual keys:
# - Supabase project URL and anon key
# - Stripe publishable key
# - A random NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
```

3. **Run development server:**
```bash
npm run dev
# Open http://localhost:3000
```

4. **Test pages:**
- Landing page: http://localhost:3000/
- Sign up: http://localhost:3000/signup
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

## 🔌 Setup Guide

### Step 1: Supabase (Free Authentication & Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (e.g., "surplus-lines-app")
3. In project settings, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Enable email authentication:
   - Go to Authentication → Providers
   - Enable Email (default is on)
5. Configure redirect URLs:
   - Authentication → URL Configuration
   - Add `http://localhost:3000/auth/callback`
   - Add `https://yourdomain.com/auth/callback` (later, for production)

### Step 2: Stripe (Free Payment Processing)

1. Go to [stripe.com](https://stripe.com) and create account
2. Go to Developers → API Keys
3. Copy:
   - **Publishable Key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** → `STRIPE_SECRET_KEY` (keep safe!)
4. Test keys are ready (no live key needed for MVP)

### Step 3: Database Schema (Supabase SQL)

In Supabase dashboard, go to SQL Editor and run:

```sql
-- Users (auto-created by Supabase Auth)
-- No setup needed

-- Calculations
CREATE TABLE calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state VARCHAR(2),
  premium DECIMAL(12, 2),
  fees DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT now()
);

-- Batch uploads
CREATE TABLE batch_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename VARCHAR(255),
  row_count INTEGER,
  total_premium DECIMAL(14, 2),
  total_tax DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT now()
);

-- SDE forms
CREATE TABLE sde_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state VARCHAR(2),
  insured_name VARCHAR(255),
  coverage_type VARCHAR(255),
  premium DECIMAL(12, 2),
  declinations JSONB, -- [{insurer, date, reason}, ...]
  created_at TIMESTAMP DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50), -- 'free', 'pro', 'enterprise'
  status VARCHAR(50), -- 'active', 'cancelled', 'past_due'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## 📁 Project Structure

```
saas-website/
├── pages/
│   ├── index.js              # Landing page
│   ├── signup.js             # Sign up page
│   ├── login.js              # Login page
│   ├── dashboard.js          # Dashboard (logged-in users)
│   ├── api/                  # API routes (to build)
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   ├── calculations.js
│   │   └── subscriptions.js
│   └── _app.js
├── styles/
│   ├── globals.css           # Global design system
│   ├── Landing.module.css
│   ├── Auth.module.css
│   └── Dashboard.module.css
├── components/               # Reusable components (to add)
├── lib/                      # Utilities (to add)
│   ├── supabase.js
│   └── stripe.js
├── public/                   # Static assets
├── .env.local.example        # Environment template
├── next.config.js
└── package.json
```

## 🎨 Design System

Colors (CSS variables):
- **Primary**: `--teal: #0E6E5C` (actions, links)
- **Background**: `--paper: #F3F5F0` (page bg)
- **Card**: `--card: #FBFCF9` (containers)
- **Text**: `--ink: #1C2721` (headlines, body)
- **Muted**: `--muted: #64705F` (secondary text)
- **Accent**: `--stamp: #8A2F28` (alerts, warnings)

Typography:
- Display: Georgia serif (headings)
- Body: System fonts (readable on all devices)
- Mono: SF Mono / Cascadia (code, data)

## 🚀 Deployment

### Vercel (Recommended — Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project from GitHub
4. Set environment variables (same as `.env.local`)
5. Deploy! Takes ~2 minutes

### Railway or Render (Alternative)

1. Connect to GitHub repo
2. Set environment variables
3. Deploy

## 📝 Next Steps

### To Connect Everything:

1. **API Routes** (`pages/api/`)
   - `auth/[...nextauth].js` — NextAuth config
   - `calculations.js` — Save/fetch calculations
   - `subscriptions.js` — Stripe webhook handling

2. **Components** (`components/`)
   - `TaxCalculator.js` — Embed existing calculator
   - `BatchUploader.js` — Batch upload interface
   - `SdeForm.js` — SDE form generator
   - `UserNav.js` — Navigation with user menu

3. **Pages to Build**
   - `/app/calculator` — Full calculator (embedded)
   - `/app/batch` — Batch upload interface
   - `/app/sde` — SDE form builder
   - `/app/history` — Saved calculations
   - `/app/settings` — User settings
   - `/app/billing` — Plan management

## 🔐 Security Notes

- **Never** commit `.env.local` (it's in `.gitignore`)
- Use environment variables for all secrets
- Keep `STRIPE_SECRET_KEY` and `NEXTAUTH_SECRET` private
- Enable Row Level Security (RLS) on Supabase tables:

```sql
-- Example: Users can only see their own calculations
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calculations"
  ON calculations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON calculations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 💰 Pricing Tiers

**Free:**
- Single-policy calculator
- All 50 states
- View results online

**Pro ($49/mo):**
- Everything in Free
- Batch upload (unlimited)
- Save & search history
- Export Excel + PDF
- SDE form generation

**Enterprise (Custom):**
- Everything in Pro
- Team accounts (5+ users)
- API access
- Custom integrations

## 📞 Support

- **Email**: support@surpluslinestax.com
- **Docs**: docs.surpluslinestax.com (to build)
- **Status**: status.surpluslinestax.com (to monitor)

## 📄 License

Proprietary — Not for redistribution

---

**Ready to launch?** Deploy to Vercel, add your Supabase + Stripe keys, and you're live. First 100 users get lifetime 50% discount for beta testing.
