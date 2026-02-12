# AI Interview Platform - Complete Setup 🎉

## Features Implemented:

### 1. Firebase Authentication ✅
- Google Sign-In on landing page
- Protected routes for dashboard
- Auto-redirect after authentication

### 2. Neon Serverless Database (Drizzle ORM) ✅
- Interviews table with user data
- Questions stored in database
- Dashboard displays user's interviews

### 3. Groq AI (Llama 3.3 70B) ✅
- AI-powered question generation
- Generates 9 personalized interview questions
- Based on job position, description, and interview types

### 4. Vapi Voice Agent ✅
- Real-time voice interviews
- AI interviewer asks questions
- Candidate speaks responses via microphone
- Professional voice interaction

## Setup Instructions:

### 1. Install Dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Update `.env` file with your Vapi public key:
```
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

Get your Vapi key from: https://dashboard.vapi.ai

### 3. Run Database Migration:
```bash
npm run db:push
```

### 4. Start Development Server:
```bash
npm run dev
```

## How It Works:

### For Recruiters:
1. Click "Get Started" → Google Sign-In
2. Go to Dashboard → "Create New Interview"
3. Fill in:
   - Job Position (e.g., "Full Stack Developer")
   - Job Description
   - Duration (15/30/45 minutes)
   - Interview Types (Technical, Behavioral, etc.)
4. Click "Generate Questions" → Groq AI creates personalized questions
5. Click "Create Interview" → Saves to database
6. Copy interview link and share with candidates

### For Candidates:
1. Open interview link (e.g., `/interview/abc-123`)
2. See interview details (position, duration)
3. Click "Start Interview" → Vapi voice agent begins
4. AI asks questions one by one
5. Candidate responds via microphone
6. Click "End Interview" when done

## Tech Stack:

- **Frontend**: React + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **Auth**: Firebase Authentication
- **Database**: Neon Serverless PostgreSQL + Drizzle ORM
- **AI Questions**: Groq (Llama 3.3 70B)
- **Voice Agent**: Vapi AI
- **Routing**: React Router

## Files Created:

### Core Setup:
- `.env` - All API keys and credentials
- `src/lib/firebase.ts` - Firebase config
- `src/lib/groq.ts` - Groq AI integration
- `src/db/schema.ts` - Database schema
- `src/db/index.ts` - Database connection
- `drizzle.config.ts` - Drizzle configuration

### Components:
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/pages/interview/CandidateInterview.tsx` - Voice interview page

### Modified:
- `src/App.tsx` - Added auth provider and routes
- `src/pages/Landing.tsx` - Google Sign-In integration
- `src/pages/CreateInterview.tsx` - Groq AI question generation
- `src/pages/Dashboard.tsx` - Display user interviews

## Database Schema:

```typescript
interviews {
  id: uuid (primary key)
  userId: text (Firebase UID)
  position: text
  description: text
  duration: text
  interviewTypes: text (JSON array)
  questions: text (JSON array)
  vapiAssistantId: text (optional)
  createdAt: timestamp
}
```

## API Keys Required:

1. **Firebase** (Already configured):
   - API Key, Auth Domain, Project ID, etc.

2. **Neon Database** (Already configured):
   - Connection string

3. **Groq** (Already configured):
   - API Key: <your_groq_api_key>

4. **Vapi** (Need to add):
   - Get from: https://dashboard.vapi.ai
   - Add to `.env` as `VITE_VAPI_PUBLIC_KEY`

## Flow Diagram:

```
Landing Page
    ↓
Google Sign-In
    ↓
Dashboard
    ↓
Create Interview → Groq AI generates questions
    ↓
Save to Database
    ↓
Share Link with Candidate
    ↓
Candidate Opens Link
    ↓
Vapi Voice Interview Starts
    ↓
AI asks questions, candidate responds
    ↓
Interview Complete
```

## Next Steps:

1. Get Vapi public key from https://dashboard.vapi.ai
2. Add it to `.env` file
3. Test the complete flow
4. Customize voice settings in `CandidateInterview.tsx` if needed

## Support:

- Vapi Docs: https://docs.vapi.ai
- Groq Docs: https://console.groq.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Drizzle Docs: https://orm.drizzle.team
