# SuperK53 - K53 Learner's License Practice Platform

## Project Overview
SuperK53 is a comprehensive K53 Learner's License preparation platform built with React, TypeScript, and Express. It features location-aware scenarios, analytics, gamification, and progress tracking for driving test preparation.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js server with TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Build System**: Vite with SWC for fast compilation
- **Deployment**: Configured for autoscale deployment

## Recent Changes (September 17, 2025)
- ✅ Configured for Replit environment
- ✅ Updated Vite config to use host 0.0.0.0:5000
- ✅ Fixed TypeScript configuration and LSP errors  
- ✅ Installed all dependencies successfully
- ✅ Set up development workflow on port 5000
- ✅ Configured deployment for production

## Project Structure
```
├── client/           # React frontend application
├── server/           # Express backend API
├── database/         # SQL schemas and migrations
├── public/           # Static assets and images
├── shared/           # Shared TypeScript types
├── netlify/          # Netlify deployment config (legacy)
├── vite.config.ts    # Vite development configuration
├── vite.config.server.ts # Server build configuration
└── package.json      # Dependencies and scripts
```

## Key Features
- **Practice Mode**: Interactive K53 questions and scenarios
- **Location-Aware**: GPS-based contextual scenarios
- **Progress Tracking**: Achievement system and analytics
- **Admin Panel**: Content management and user analytics
- **PWA Support**: Progressive Web App capabilities
- **Subscription System**: PayPal integration for premium features
- **Image Library**: Extensive road sign and scenario images

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (builds client and server)
- **Start**: `npm start` (production server)

## Environment Variables Needed
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `VITE_PAYPAL_CLIENT_ID`: PayPal client ID (optional)
- `PAYPAL_CLIENT_SECRET`: PayPal client secret (optional)

## User Preferences
- Uses modern React patterns with hooks and suspense
- TypeScript strict mode enabled for type safety
- Modular component architecture with clear separation
- Responsive design with mobile-first approach

## Current Status
✅ **Ready for Development** - The application is successfully configured and running in the Replit environment.

### Production Deployment
The project is configured for autoscale deployment which is suitable for this stateless web application. The build process compiles both client and server code, and the production server serves the built frontend files alongside the API.

### Next Steps
- Set up environment variables for Supabase and PayPal integration
- Populate the database with K53 questions and scenarios
- Configure any additional integrations as needed