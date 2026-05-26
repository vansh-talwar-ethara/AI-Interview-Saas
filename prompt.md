# IntervueX — Full-Stack AI Interview Simulator

## Context and Role

You're a full-stack MERN engineer who specializes in building AI-powered SaaS products. Your job here is to design and ship IntervueX — a production-ready AI interview simulator that puts users through realistic, adaptive technical interviews. The AI interviewer reacts to every answer in real time, pushes back with follow-up questions when answers are weak, runs live coding sessions, tracks how well the candidate communicates, and hands them a detailed feedback report when it's all over. The entire platform needs to be fast, secure, and built to scale.

---

## Objective

Build a complete full-stack SaaS application that:

- Runs realistic AI-driven interviews across technical, behavioral, DSA, and system design formats.
- Talks to users through a voice pipeline — speech goes in, AI voice comes back out.
- Hosts a live coding room where candidates write and run code while the AI evaluates it.
- Asks smarter follow-up questions the moment it detects a weak or incomplete answer.
- Tracks behavioral signals like filler words, speaking pace, and confidence in real time.
- Reads the candidate's resume and builds interview questions around their actual experience.
- Wraps up every session with a scored feedback dashboard and a step-by-step improvement plan.
- Runs on a free, pro, and enterprise tier model with features locked at the API level.

---

## Interview Engine Requirements

- Cover five interview formats: Technical, DSA, System Design, Behavioral (HR), and Project Discussion.
- Before the session starts, let the user pick:
  - **Role:** Frontend, Backend, MERN, DevOps, AI/ML, Java, Python
  - **Difficulty:** Beginner, Intermediate, Advanced
  - **Company style:** Google-like, Amazon-like, Startup, FAANG pressure, Beginner-friendly
- The moment an answer sounds shallow, wrong, or incomplete, the AI digs deeper with a targeted follow-up. For example, if a candidate says "JWT stores authentication," the AI should immediately ask about XSS exposure of tokens sitting in localStorage — not move on.
- Ship a Persona Engine with five interviewer personalities: strict, friendly mentor, FAANG pressure, rude startup CTO, and fast HR recruiter. Each one needs a genuinely different tone, pace, and level of follow-up aggression — wired directly into the prompt, not layered on top afterward.
- The AI can never repeat a question it already asked in the same session.
- Every LLM response streams to the client — no waiting for the full reply before the user sees anything.

---

## Voice Interview Pipeline

- Pick up microphone audio from the browser and pipe it straight to the backend for transcription.
- Run it through Whisper API or Deepgram. The time between the candidate finishing a sentence and getting back a transcript must stay under 2 seconds.
- Hand that transcript to the LLM to evaluate the answer and decide what to ask next.
- Convert the AI's reply to speech using ElevenLabs or OpenAI TTS and stream the audio back.
- If the candidate starts talking while the AI is still speaking, cut the TTS stream immediately.
- Keep a plain text fallback ready for anyone whose mic isn't working.

---

## Live Coding Interview Room

- Drop in Monaco Editor with JavaScript, TypeScript, Python, Java, and C++ support.
- Run submitted code through Judge0 API and send back stdout, stderr, and execution time.
- After every submission, the AI checks correctness, time complexity, space complexity, and readability.
- If the candidate has failed twice and is clearly stuck, the AI drops a small hint — just enough to nudge them in the right direction, never the full answer.
- Keep the editor in sync across all participants over Socket.io for multiplayer sessions.

---

## Behavioral Interview Analyzer

Pull these metrics out of every transcribed answer:

- Filler word count (um, uh, like, you know)
- Speaking speed in words per minute
- Answer clarity score (0–100)
- Confidence score (0–100) based on hedging phrases and sentence structure

Show the numbers right there on screen as each answer comes in, then roll them all up in the dashboard at the end.

---

## Resume-Based Interview Generation

- Take PDF or DOCX uploads and parse them server-side with pdfjs or mammoth.
- Pull out tech stack, project names, claimed skills, and years of experience.
- Turn those details into interview questions that call out the candidate's own resume. If they listed Redis caching, ask them to walk through a cache invalidation problem they actually faced.
- Save the parsed data to MongoDB under the user's profile so they don't have to re-upload next time.

---

## AI Feedback Dashboard

At the end of every session, show:

- A score split across three dimensions: Technical (0–100), Communication (0–100), and Problem Solving (0–100).
- A question-by-question breakdown — what was asked, what the candidate said, how the AI scored it, and every follow-up that came after.
- The weak topics that kept showing up, with resources to fix them.
- A personal roadmap with three to five concrete next steps.
- A line chart of score trends across all past sessions and a bar chart of the most common weak topics.
- Every number on these charts comes from the backend — nothing gets computed on the client from raw session data.

---

## Input Validation Requirements

- Run every incoming request body through Zod or Joi on the server before a single line of business logic touches it.
- If a required field is missing, reject the request right away with a 400 and a message that names the exact field that failed and explains why.
- Type-check everything strictly: session config values like role, difficulty, and companyStyle must be one of their allowed options; scores must land between 0 and 100; uploaded files must be PDF or DOCX and can't exceed 5MB.
- Check email format against RFC 5322-compliant regex on both ends. If it's malformed, stop it before it ever hits the database.
- Strip HTML tags and escape special characters from every string input before it gets processed or saved — that's the baseline defense against XSS and injection.
- On the frontend, show validation errors right next to the field as the user types. Don't make them hit submit to find out something's wrong.

---

## Error Handling Requirements

- Every failure returns the same response shape: `{ success: false, data: null, error: { code: string, message: string, field?: string } }`. The code is a machine-readable constant like `VALIDATION_ERROR` or `RATE_LIMIT_EXCEEDED`. The message is plain English.
- The global error middleware sits at the very end of the Express chain. It catches everything that slips through and wraps it into that standard shape before anything goes back to the client.
- Stack traces, raw database errors, and environment variable names never leave the server. Log them, don't send them.
- These specific failures each need their own code and response:
  - LLM timeout or rate limit hit → 503, `UPSTREAM_UNAVAILABLE`, include a retry-after hint
  - Judge0 can't run the code → 422, `CODE_EXECUTION_FAILED`, include the raw stderr
  - Resume won't parse → 422, `RESUME_PARSE_ERROR`, tell the user to try re-uploading
  - Stripe webhook signature is wrong → 400, `INVALID_WEBHOOK_SIGNATURE`
  - JWT is expired or fake → 401, `TOKEN_INVALID`
- Frontend catches every API error at the service layer and shows a readable message in the UI. A broken promise should never leave the user staring at a blank screen.
- Backend errors get logged through Winston or Pino with these fields every time: timestamp, error code, request ID, user ID if there is one, and stack trace. Use info, warn, and error levels correctly.

---

## Backend and API Requirements

- Build the REST API on Node.js and Express.js.
- Wire Socket.io for voice transcription streaming, coding room sync, and multiplayer coordination.
- Push resume parsing and post-interview report generation into BullMQ queues backed by Redis — they're too slow to run inline.
- Cap free tier users at 10 LLM calls per minute on all AI endpoints.
- Every response ships in this shape: `{ success: boolean, data: object | null, error: string | null }`
- Scrub all inputs clean before they touch the database or any downstream service.
- JWT handles auth with refresh token rotation. Access tokens die after 15 minutes.

---

## Database Design

MongoDB with Mongoose, seven collections:

- **users** — credentials, subscription tier, profile data
- **interviews** — session config (role, difficulty, company style), start/end times, status
- **questions** — question text, type, difficulty, linked interview ID
- **answers** — what the candidate said, AI evaluation, follow-up chain, per-question scores
- **coding_submissions** — code, language, Judge0 output, AI review
- **resumes** — extracted text, skills list, linked user ID
- **analytics** — rolled-up scores, behavioral metrics, weak topic tags

Put indexes on `userId`, `interviewId`, and `createdAt` wherever they show up in queries.

---

## SaaS Monetization

- **Free:** 3 text interviews a day, no voice, no company-style modes.
- **Pro:** Unlimited interviews, full voice AI, every company mode, complete analytics, resume-based sessions.
- **Enterprise:** Everything in Pro plus the recruiter dashboard, candidate invites, bulk analytics, auto-shortlisting, and white-label options.
- Stripe handles billing. When a payment event hits the webhook, the user's tier updates immediately.
- Tier checks live at the API level — the UI alone is not enough.

---

## Recruiter Dashboard (Enterprise)

- Recruiters build custom tests by choosing questions and setting a time limit.
- Candidates get invited by email through a one-time session link.
- The dashboard shows each candidate's scores, weak topics, behavioral breakdown, and code submissions.
- Reports export as PDFs.
- Anyone who clears the score threshold gets auto-shortlisted.

---

## AI Cheating Detection

- Watch for and log four things: tab switches, copy-paste events, silence that stretches past 90 seconds, and answer length that spikes suspiciously.
- Flag those sessions in the database and show the flags to enterprise recruiters in their dashboard.
- Never auto-disqualify. The recruiter makes the final call.

---

## Output Requirements

- All interview modes work end to end.
- Voice pipeline stays under 2 seconds from speech to response.
- Coding room supports multiple languages with live execution and AI review.
- Feedback dashboard renders charts and a personalized roadmap after every session.
- Resume upload flows into personalized question generation without friction.
- Stripe billing controls feature access at the API level.
- Enterprise dashboard gives recruiters full candidate visibility and shortlisting controls.
- Validation errors appear inline next to the right field on the client.
- Every backend failure logs structured data and returns the standard error shape.

---

## Error Handling and Documentation

- All error responses carry an HTTP status code, a machine-readable code, and a plain-English message.
- Global error middleware in Express catches every unhandled rejection.
- Winston or Pino logs everything at the right level: info, warn, or error.
- The README covers:
  - Full folder or monorepo structure
  - How to set up locally and configure environment variables
  - How to get API keys working for OpenAI, ElevenLabs, Deepgram, and Judge0
  - Step-by-step deployment for Vercel, Render or Railway, MongoDB Atlas, and Upstash Redis

---

## Performance and Scalability

- Monaco Editor and all chart components load lazily — nothing heavy hits the initial bundle.
- User profile, subscription tier, and question bank stay in Redis cache with a 5-minute TTL.
- Any input field that triggers an API call gets a 300ms debounce.
- Socket.io rooms get torn down the moment a session disconnects — no lingering state.
- The backend is modular and service-oriented so individual pieces can be pulled out into microservices later without rewriting everything.
- Every LLM prompt lives as a versioned constant — never written inline — so the team can iterate on prompts without touching application code.

---

## Technology Stack

**Frontend**
- React (Vite) or Next.js
- Tailwind CSS
- Redux Toolkit or Zustand
- Monaco Editor
- Socket.io-client
- WebRTC (for multiplayer sessions)
- Recharts or Chart.js (analytics dashboard)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Redis (caching + BullMQ queue)
- Socket.io
- JWT (access + refresh tokens)
- Zod or Joi (input validation)
- dotenv for environment configuration

**AI Stack**
- LLM: OpenAI GPT-4.1 or Google Gemini
- Speech-to-Text: Whisper API or Deepgram
- Text-to-Speech: ElevenLabs or OpenAI TTS
- Code Execution: Judge0 API
- Embeddings: OpenAI embeddings (for RAG-based question generation)

**Infrastructure**
- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
- Redis: Upstash
- File storage: Cloudinary or AWS S3 (resume uploads)
- Payments: Stripe
