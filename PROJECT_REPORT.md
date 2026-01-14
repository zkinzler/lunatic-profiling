# Lunatic Profiling - Project Report

**Last Updated:** January 14, 2026
**Status:** DEPLOYED TO PRODUCTION
**Live URL:** https://lunatic-profiling.vercel.app

---

## Project Overview

Lunatic Profiling is a satirical personality quiz with British humor that determines your "chaos archetype." Users answer 24 questions across 3 phases, receive AI-generated roasts after each answer, and get a personalized "Lunacy Blueprint" at the end.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma |
| Hosting | Vercel |
| AI | OpenAI GPT-4o-mini |
| Email | Resend |
| Styling | Tailwind CSS |

---

## Architecture

### Quiz Flow
1. User enters email → Session created with unique `sessionId` and `publicId`
2. 24 questions across 3 phases (8 questions each)
3. Phase multipliers: 1x, 2x, 3x for scoring
4. Users rank up to 3 answers per question
5. AI-generated roast shown after each answer
6. Phase transitions at Q8 and Q16 with standings display
7. Final grading generates AI-enhanced Lunacy Blueprint
8. Results stored in database, shareable via `publicId`

### 9 Archetypes
- VN: Velvet Nightmare (Bullshit Slayer)
- CTD: Chaos Tea Dealer (Chaos Architect)
- YO: YOLO Ohno (Vibe Commando)
- SO: Spreadsheet Overlord (Efficiency Berserker)
- DL: Dalai Lemma (Apology Ninja)
- MM: Manifestor of Mystery (Mystery Curator)
- TMZ: Tea Master of Zen (Zen Bastard)
- CS: Chaos Slayer (Problem Annihilator)
- BN: Baffled Normie (Sensible Weapon)

### 4 Traits
- BST: Bullshit Tolerance
- CPR: Chaos Precision
- AE: Apology Efficiency
- BS: British Stoicism

---

## Key Files

### Core Quiz Logic
- `src/lib/questions.ts` - All 24 questions with answers, weights, traits
- `src/lib/archetypes.ts` - 9 archetype definitions
- `src/lib/traits.ts` - 4 trait definitions
- `src/lib/scoring.ts` - Scoring engine with phase multipliers
- `src/lib/transitions.ts` - Phase transition logic
- `src/lib/blueprint.ts` - Blueprint generation (template + AI)
- `src/lib/roasts.ts` - Template roasts (fallback)
- `src/lib/openai.ts` - OpenAI integration for AI roasts/blueprints

### API Routes
- `src/app/api/user/start/route.ts` - Create quiz session
- `src/app/api/quiz/save/route.ts` - Save answer
- `src/app/api/quiz/roast/route.ts` - Generate roast (AI + fallback)
- `src/app/api/quiz/transition/route.ts` - Phase transitions
- `src/app/api/quiz/grade/route.ts` - Final grading with AI blueprint
- `src/app/api/quiz/result/[sessionId]/route.ts` - Fetch result by session
- `src/app/api/quiz/public/[publicId]/route.ts` - Fetch result by public ID
- `src/app/api/quiz/email/route.ts` - Email results
- `src/app/api/health/route.ts` - Health check endpoint

### Pages
- `src/app/page.tsx` - Homepage/landing
- `src/app/quiz/[sessionId]/page.tsx` - Quiz taking
- `src/app/result/[sessionId]/page.tsx` - Results (private)
- `src/app/share/[publicId]/page.tsx` - Results (shareable)

### Production Infrastructure
- `src/lib/validation.ts` - Zod input validation schemas
- `src/lib/errors.ts` - Custom error classes
- `src/lib/logger.ts` - Structured JSON logging
- `src/lib/env.ts` - Environment validation
- `src/middleware.ts` - Rate limiting
- `prisma/schema.prisma` - Database schema

---

## What We Built (Session Summary)

### Phase 1: Database Migration
- Migrated from SQLite to PostgreSQL (Neon serverless)
- Updated Prisma schema provider
- Connected to Neon production database

### Phase 2: Security Hardening
- Added Zod input validation for ALL API routes
- Created rate limiting middleware:
  - `/api/user/start`: 10 req/min
  - `/api/quiz/grade`: 5 req/min
  - `/api/quiz/roast`: 30 req/min
  - `/api/quiz/email`: 3 req/min
- Added security headers (X-Frame-Options, CSP, etc.)

### Phase 3: Error Handling & Logging
- Created structured JSON logger with request ID tracking
- Created custom error classes (ValidationError, NotFoundError, etc.)
- Standardized error responses across all routes

### Phase 4: Health & Monitoring
- Created `/api/health` endpoint
- Added environment validation with fail-fast behavior
- Health check shows: database status, OpenAI status, Resend status

### Phase 5: OpenAI Integration
- Created `src/lib/openai.ts` with:
  - `generateAIRoast()` - Personalized roasts after each answer
  - `generateAIBlueprint()` - Personalized blueprint sections
- Both fall back to templates if OpenAI unavailable
- Uses GPT-4o-mini for cost efficiency

### Phase 6: Bug Fixes
- Fixed Next.js 14 params syntax (not Promise-based like Next.js 15)
- Fixed result page redirect (sessionId instead of publicId)
- Fixed phase 2→3 transition validation schema (position vs score)

### Phase 7: Deployment
- Created `vercel.json` configuration
- Deployed to Vercel
- Configured all environment variables

---

## Environment Variables (Production)

```
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=xK9mP2vL8qR5wT3yJ7nB4cF6hD1sA0eG
NEXTAUTH_URL=https://lunatic-profiling.vercel.app
NEXT_PUBLIC_APP_URL=https://lunatic-profiling.vercel.app
RESEND_API_KEY=re_FLdfS4Lw_DZEQ1mcwZZuRTANBUGf3JPCP
OPENAI_API_KEY=sk-proj-...
```

---

## Development Workflow

```bash
# Run locally
pnpm dev

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build

# Deploy (automatic on push)
git add -A && git commit -m "message" && git push origin main
```

---

## Database Schema (Key Models)

### QuizSession
- `id` (sessionId) - Private identifier
- `publicId` - Shareable identifier
- `email` - User email
- `answers` - JSON of all answers
- `currentPhase` - 1, 2, or 3
- `completed` - Boolean

### Result
- All archetype scores and percentages
- All trait scores and percentages
- Blueprint sections (coreDriver, superpower, kryptonite, etc.)
- Chaos pattern analysis
- Britishness quotient
- ASCII damage chart

---

## API Response Format

All API routes return:
```json
{
  "success": true,
  "data": "...",
  "requestId": "req_xxx_xxx"
}
```

Errors return:
```json
{
  "error": "message",
  "code": "ERROR_CODE",
  "requestId": "req_xxx_xxx"
}
```

---

## Testing Checklist

- [ ] Health check shows all services up
- [ ] Can create new session
- [ ] Can save answers
- [ ] Phase 1→2 transition works
- [ ] Phase 2→3 transition works
- [ ] AI roasts generate (isAIGenerated: true)
- [ ] AI blueprint generates (isAIEnhanced: true)
- [ ] Results page loads
- [ ] Share page loads
- [ ] Email sending works

---

## Future Improvements (Ideas)

- Add Sentry for error monitoring
- Add analytics/tracking
- Add social sharing images (OG images)
- Add result comparison feature
- Add admin dashboard for viewing stats
- Add custom domain

---

## Contacts & Resources

- **Vercel Dashboard:** vercel.com/dashboard
- **Neon Database:** console.neon.tech
- **Resend:** resend.com/emails
- **OpenAI:** platform.openai.com

---

*This report was generated on January 14, 2026 after successful production deployment.*
