# SuperK53 - K53 Learner's License Practice Platform

A comprehensive K53 learner's license preparation platform for South African driving students, featuring AI-powered location-aware scenarios and traditional practice tests.

## 🚀 Features

- **K53 Practice Tests**: Traditional question-based tests covering Vehicle Controls, Road Signs, and Traffic Rules
- **AI Scenarios**: 220+ location-aware driving scenarios tailored to South African cities
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
├── pages/                # Route components (Index.tsx = home)
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

## 🚀 Production Status

### ✅ What's Working

- Complete K53 question bank (1000+ questions)
- 220+ AI scenarios with location awareness
- User authentication and progress tracking
- Offline functionality with graceful degradation
- Professional UI/UX design

### ⚠️ Production Blockers

- **Payment integration missing** (alerts only, no real billing)
- **Subscription enforcement not implemented** (easily bypassed)
- **Database tables for monetization missing**
- **Environment security needs setup** (see SECURITY.md)

## 📋 Roadmap to Production

### Phase 1: Security & Environment ✅ COMPLETED

- [x] Remove hardcoded credentials
- [x] Set up environment variables
- [x] Create security documentation

### Phase 2: Database Setup (Next)

- [ ] Create subscription management tables
- [ ] Implement usage tracking
- [ ] Set up Row Level Security (RLS)

### Phase 3: Payment Integration

- [ ] Integrate PayFast (South African payment gateway)
- [ ] Implement subscription lifecycle management
- [ ] Add webhook handling for payments

### Phase 4: Production Deployment

- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Add monitoring and error reporting

## 💰 Monetization Model

### Free Tier

- 5 AI scenarios per day
- Basic progress tracking
- All standard K53 questions

### SuperK53 Basic (R50/month)

- Unlimited scenarios and questions
- Advanced progress tracking
- Location-specific content

### SuperK53 Pro (R120/month)

- Everything in Basic
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
