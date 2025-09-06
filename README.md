# SuperK53 - K53 Learner's License Practice Platform

A comprehensive K53 learner's license preparation platform for South African driving students, featuring AI-powered location-aware scenarios and traditional practice tests.

## 🚀 Features

- **K53 Practice Tests**: Traditional question-based tests covering Vehicle Controls, Road Signs, and Traffic Rules
- **AI Scenarios**: 429 location-aware driving scenarios tailored to South African cities
- **Progress Tracking**: Comprehensive analytics and performance monitoring
- **Offline Support**: Works even without internet connectivity
- **Location-Specific Content**: Scenarios customized for different regions
- **Freemium Model**: Free daily scenarios with premium unlimited access

## ⚠️ Security Setup (REQUIRED)

**CRITICAL**: This app requires environment configuration before it will work.

### 1. Quick Start

```bash
# Clone and install
git clone <repository>
cd superk53
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials (see SECURITY.md)
nano .env
```

### 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → API in your project dashboard
3. Copy your Project URL and anon public key
4. Update your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:8080` to access the platform.

## 📁 Project Structure

```
client/                   # React SPA frontend
├─�� pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── data/                 # K53 questions and scenarios
├── services/             # Business logic and API calls
├── contexts/             # React contexts (auth, etc.)
└── lib/                  # Utilities and configurations

server/                   # Express API backend
├── index.ts              # Main server setup
└── routes/               # API handlers

database/                 # Database setup scripts
├── setup-db.ts           # Initial database setup
└── migrate-scenarios.ts  # Scenario data migration

shared/                   # Types used by both client & server
└── api.ts                # Shared API interfaces
```

## 🛠 Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test           # Run tests
```

## 🚀 Production Status: READY FOR BUSINESS 🎉

### ✅ Production-Ready Features

- ✅ Complete K53 question bank (85 questions in database, 69 local fallback)
- ✅ 429 AI scenarios with location awareness
- ✅ PayPal payment integration with card/guest checkout
- ✅ Real database-backed subscription management
- ✅ Server-side usage enforcement (unbypassable)
- ✅ Row Level Security and data protection
- ✅ User authentication and progress tracking
- ✅ Admin dashboard for business monitoring
- ✅ Offline functionality with graceful degradation
- ✅ Professional UI/UX design

### 💰 Revenue Ready

- **Payment Processing**: PayPal integration with SA-friendly card checkout
- **Subscription Plans**: Free (5 scenarios/day), Basic (R50/month), Pro (R120/month)
- **Scenario Packs**: Individual purchases (R20-R30 each)
- **Server-Side Enforcement**: Prevents client-side bypass attempts
- **Real-Time Activation**: Subscriptions activate immediately after payment

## 📋 Development Phases: ALL COMPLETED ✅

### Phase 1: Security & Environment ✅ COMPLETED

- [x] Remove hardcoded credentials
- [x] Set up environment variables
- [x] Create security documentation

### Phase 2: Database Setup ✅ COMPLETED

- [x] Create subscription management tables
- [x] Implement usage tracking
- [x] Set up Row Level Security (RLS)

### Phase 3: Payment Integration ✅ COMPLETED

- [x] Integrate PayPal (better for SA than PayFast)
- [x] Implement subscription lifecycle management
- [x] Add server-side payment validation

### Phase 4: Production Deployment ✅ READY

- [x] Database schema ready
- [x] Environment configured
- [x] Business monitoring dashboard
- [x] Security hardening complete

## 💰 Monetization Model

### Free Tier

- 5 AI scenarios per day
- Basic progress tracking
- All standard K53 questions

### SuperK53 Basic (R39/month)

- 25 AI scenarios per day
- Enhanced progress tracking
- Location-specific content

### SuperK53 Standard (R69/month)

- Unlimited scenarios and questions
- Advanced progress tracking
- Mock K53 tests

### SuperK53 Premium (R99/month)

- Everything in Standard
- All scenario packs included
- Offline access
- Priority support

### Scenario Packs (R20-R30 each)

- Cape Town Coastal Pack
- Johannesburg Urban Pack
- Rural Roads Pack
- And more...

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **Backend**: Express.js + Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI + Custom components
- **State Management**: React Context + Local Storage
- **Deployment**: Netlify (current) / Production TBD

## 📚 Documentation

- [Security Setup](SECURITY.md) - **START HERE**
- [Implementation Notes](IMPLEMENTATION_NOTES.md)
- [Agent Guidelines](AGENTS.md)

## 📊 Data Storage & Access

### Database (Supabase)
- **Scenarios**: 429 records in `public.scenarios` table
- **Questions**: 85 records in `public.questions` table
- **Test Centers**: 3 records in `public.test_centers` table
- **User Data**: `public.user_subscriptions`, `public.user_progress`
- **Analytics**: `public.user_analytics`, `public.system_notifications`

### Local Files
- **Questions Fallback**: `client/data/k53Questions.ts` (69 questions)
- **Images**: `public/images/` (4,523 images)
- **Configuration**: `client/lib/supabase.ts`, `client/lib/env.ts`

### API Endpoints
- **Development**: http://localhost:3000
- **Questions**: `GET /api/content/questions` (returns 85 questions)
- **Scenarios**: `GET /api/content/scenarios` (returns 429 scenarios)
- **Enterprise**: `GET /api/enterprise/dashboard-stats` (returns JSON stats)

### ⚠️ Known Issues
- **Test Centers**: Only 3 test centers vs claimed 500+
- **Language Support**: Claims 11 languages but only English implemented
- **Success Rate**: Claims 92% success rate without real data

### Environment Configuration
**File**: `.env`
**Required Variables**:
```
VITE_SUPABASE_URL=https://lxzwakeusanxquhshcph.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
PAYPAL_CLIENT_ID=[your-paypal-client-id]
PAYPAL_CLIENT_SECRET=[your-paypal-client-secret]
```

### Running the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access application
http://localhost:3000
```

## 🤝 Contributing

1. Ensure security setup is complete (see SECURITY.md)
2. Create feature branch
3. Follow existing code patterns and conventions
4. Test offline functionality
5. Submit PR with clear description

## 📄 License

[License information here]

---

**Need Help?** Check [SECURITY.md](SECURITY.md) for detailed setup instructions or create an issue.
