# Lunatic Profiling

A modern psychological archetype assessment platform that uses AI-powered analysis to provide deep insights into personality patterns and behavioral tendencies.

## Features

- **Interactive Assessment**: 8 carefully crafted questions with ranked response options
- **AI-Powered Analysis**: Advanced psychological profiling using OpenAI GPT models
- **Beautiful Results**: Visual archetype breakdowns with ASCII art personality maps
- **Email Integration**: Automated result delivery via Resend
- **Shareable Profiles**: Public links for sharing results with others
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma, SQLite

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Installation

1. **Clone and setup the project**:
   ```bash
   git clone <repository-url>
   cd lunatic-profiling
   pnpm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API keys:
   - `RESEND_API_KEY`: Get from [Resend](https://resend.com)
   - `OPENAI_API_KEY`: Get from [OpenAI](https://openai.com)

3. **Database setup**:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page
│   ├── quiz/[sessionId]/   # Quiz interface
│   ├── result/[sessionId]/ # Results page
│   ├── share/[publicId]/   # Public sharing page
│   └── api/                # API routes
├── components/             # React components
│   ├── QuestionCard.tsx    # Quiz question component
│   ├── Progress.tsx        # Progress indicator
│   ├── ArchetypeTable.tsx  # Results table
│   └── AsciiBlock.tsx      # ASCII art display
├── lib/                    # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── llm.ts             # AI analysis
│   └── normalize.ts       # Score normalization
├── emails/                 # Email templates
│   └── ResultEmail.tsx     # Results email template
└── schemas/                # Zod validation schemas
    └── result.ts          # Result type definitions
```

## Core Flow

1. **Email Capture**: User enters email on landing page
2. **Quiz Session**: Creates new session, redirects to `/quiz/[sessionId]`
3. **Assessment**: 8 questions, up to 3 ranked answers each
4. **Analysis**: AI processes responses and generates archetype profile
5. **Results**: Display percentages, overlaps, ASCII map, and summary
6. **Sharing**: Generate public link and email results

## API Endpoints

- `POST /api/user/start` - Create quiz session
- `POST /api/quiz/save` - Save quiz answers
- `POST /api/quiz/grade` - Generate AI analysis
- `GET /api/quiz/result/[sessionId]` - Get private results
- `GET /api/quiz/public/[publicId]` - Get public results
- `POST /api/quiz/email` - Send results email

## Database Schema

### QuizSession
- `id`: Unique session identifier
- `publicId`: Public sharing identifier
- `email`: User email
- `answers`: JSON of quiz responses
- `completed`: Completion status

### Result
- `sessionId`: Links to QuizSession
- `scores`: Raw trait scores
- `percentages`: Normalized percentages
- `topArchetypes`: Top 5 archetypes
- `overlaps`: Similar archetypes (within 5%)
- `asciiChart`: Visual personality map
- `summary`: AI-generated analysis

## Configuration

### Email Provider
Configure Resend in your environment:
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
```

## Test Plan

### Happy Path Test
1. Visit landing page
2. Enter email: `test@example.com`
3. Complete all 8 questions with ranked answers
4. Verify results page shows:
   - Top 5 archetypes with percentages
   - ASCII personality map
   - AI-generated summary
5. Test email functionality
6. Test public share link

### Edge Cases
- **Overlap Detection**: Select very similar answer patterns to trigger 5% similarity overlaps
- **Partial Completion**: Test saving progress and resuming
- **Invalid Sessions**: Test with non-existent session IDs
- **Public Sharing**: Verify public pages don't expose private data

### Expected Results
- Primary archetype should be clearly dominant (>60%)
- Overlaps should appear when archetypes are within 5%
- ASCII chart should visually represent top archetypes
- Email should be delivered within 30 seconds
- Public share links should work without authentication

## Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma studio` - Open Prisma database viewer

### Environment Variables
See `.env.example` for complete list of required environment variables.

## Deployment

### Database Migration
```bash
pnpm prisma generate
pnpm prisma db push
```

### Production Build
```bash
pnpm build
pnpm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub issue tracker.
