# TODO: Email Setup Required

## Next Time You Work on This Project

### Set up email sending via Resend

You need to add these environment variables to your `.env` file:

1. **RESEND_API_KEY**
   - Get a free API key from https://resend.com
   - Sign up and verify your account
   - Create an API key in the dashboard

2. **EMAIL_FROM**
   - Format: `"Lunatic Profiling <noreply@yourdomain.com>"`
   - Must be a verified domain in Resend
   - For testing, use Resend's test domain or verify your own

3. **NEXT_PUBLIC_APP_URL**
   - Currently should be: `"http://localhost:3001"`
   - Update to your production URL when deploying

4. **RESULTS_DEV_RECIPIENT** (optional for testing)
   - Set to your email to receive all test emails
   - Example: `"your-test-email@gmail.com"`
   - This overrides the quiz taker's email for development

### Current Status
- ✅ Quiz flow working
- ✅ Results page fixed (overlap bug resolved)
- ✅ Database tracking all responses
- ✅ Prisma Studio available at http://localhost:5555
- ❌ Email sending (needs Resend API key)

### Quick Start Commands
```bash
npm run dev          # Start app on http://localhost:3001
npx prisma studio    # View database at http://localhost:5555
```
