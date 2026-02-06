# Claude Project Notes - The Culling

## Current Status: COMPLETE & LIVE ✅
Last updated: Feb 6, 2026 - All features working, deployed to Vercel.

## What This Project Is
**The Culling** is a UK comedy personality quiz that determines users' "comedic ghost type" through brutal, Frankie Boyle-style humour. It's hosted at https://lunatic-profiling.vercel.app

## Quick Start
```bash
npm run dev      # Start dev server
npm run build    # Verify production build
npx prisma studio  # View database
```

## Project Structure

### Core Quiz Logic (`src/lib/culling/`)
| File | Purpose |
|------|---------|
| `gates.ts` | 5 qualification gates (UK-themed yes/no questions) |
| `questions.ts` | 10 main quiz questions (Wetherspoons, NHS app, etc.) |
| `ghosts.ts` | 4 ghost types: CD (Surgical), CA (Chaos), OB (Observational), DD (Deadpan) |
| `roasts.ts` | Roasts shown after each answer, phase-specific |
| `scoring.ts` | Calculates ghost scores, 4+ = elite (4%), otherwise culled (96%) |
| `email-cta.ts` | Frank Kern-style email capture escalation |

### API Routes (`src/app/api/culling/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/start` | POST | Create new session (starts in 'gates' phase) |
| `/session/[id]` | GET | Get session state |
| `/session/[id]` | PATCH | Transition phases (e.g., intro → gates) |
| `/gate` | POST | Submit gate answer |
| `/answer` | POST | Submit quiz answer |
| `/grade` | POST | Calculate final result |
| `/result/[id]` | GET | Get full result with roast |
| `/email` | POST | Capture email (with escalation) |

### Pages (`src/app/culling/`)
- `/culling` - Landing page (type START to begin)
- `/culling/quiz/[sessionId]` - Gates + main questions
- `/culling/result/[sessionId]` - Results page
- `/culling/share/[publicId]` - Public shareable results

## Database Schema (PostgreSQL)

### CullingSession
- `email` - Captured email (nullable)
- `gateAnswers` - JSON: `{gate1: true, gate2: false, ...}`
- `mainAnswers` - JSON: `{cq1: "A", cq2: "B", ...}`
- `culled` / `culledAtGate` / `culledReason`
- `emailCtaStage` - 0=initial, 1=first_no, 2=second_no, 3=captured

### CullingResult
- `ghostCD`, `ghostCA`, `ghostOB`, `ghostDD` - Score counts
- `dominantGhost` - Primary ghost type
- `isElite` - true if 4+ answers for one type

## Ghost Type Mapping

**Questions 1-5:** A=DD, B=CA, C=OB, D=CD
**Questions 6-10:** A=CD, B=CA, C=OB, D=DD

## Content Source
The MVP spec is in `Final Version for MVP 2-3-26 Reviewed.docx` at the project root.

## Environment Variables
```
DATABASE_URL=postgresql://...     # Required - Neon/Supabase PostgreSQL
OPENAI_API_KEY=sk-...             # Required - For AI features
RESEND_API_KEY=re_...             # Optional - For sending emails
```

## Deployment
- Vercel auto-deploys from `main` branch
- Dashboard: https://vercel.com/zach-kinzlers-projects/lunatic-profiling

## Known Issues / Notes
- Homepage (`/`) redirects to `/culling`
- Sessions start directly in 'gates' phase (fixed double-START bug)
- Gate pass/fail messages are UK-specific from the MVP doc
