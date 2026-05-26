# IntervueX

IntervueX is a monorepo starter for an AI technical interview simulator with a React frontend and an Express backend.

## Structure

- `apps/web` - React + Vite frontend for interview sessions, dashboards, and recruiter views
- `apps/api` - Express + Socket.io backend for interviews, auth, AI orchestration, billing, queues, and analytics
- `packages/shared` - shared types, response contracts, plan limits, and prompt constants

## Local Setup

1. Copy `.env.example` to `.env` and fill in the secrets.
2. Install dependencies with `npm install`.
3. Run the apps with `npm run dev`.

## Run On Localhost

This repo starts the frontend and backend together from the root, or you can run them separately in different terminals.

### Run Both Apps Together

```bash
npm run dev
```

This starts:

- Frontend at `http://localhost:3000`
- Backend API at `http://localhost:4000`

### Run Backend Only

```bash
npm run dev --workspace @intervuex/api
```

The backend listens on `http://localhost:4000`.

### Run Frontend Only

```bash
npm run dev --workspace @intervuex/web
```

The frontend runs on `http://localhost:3000` and expects the API at `VITE_API_URL`.

## AI Services

- OpenAI or Gemini powers interviewer generation and structured evaluation.
- Deepgram or Whisper handles speech-to-text.
- ElevenLabs or OpenAI TTS handles text-to-speech.
- Judge0 executes live coding submissions.
- Resume parsing uses `pdf-parse` for PDFs and `mammoth` for DOCX files.

## Environment Variables

Required values include:

- `MONGODB_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY`
- `DEEPGRAM_API_KEY`
- `ELEVENLABS_API_KEY`
- `JUDGE0_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Recommended supporting values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Deployment

1. Deploy `apps/web` to Vercel with `VITE_API_URL` pointing to the backend URL.
2. Deploy `apps/api` to Render or Railway with the production environment variables set.
3. Provision MongoDB Atlas and point `MONGODB_URI` at the cluster.
4. Provision Upstash Redis and point `REDIS_URL` at the managed Redis endpoint.
5. Configure Stripe webhooks to hit the backend billing route and update tiers in real time.
6. Store file uploads in Cloudinary or S3 before enqueueing resume parsing jobs.

## Performance And Scalability

- Monaco and charting components are lazy-loaded to reduce the initial bundle.
- Frequently accessed data such as profiles, tiers, and question banks should be cached in Redis with a 5 minute TTL.
- User input that triggers API calls should be debounced on the client.
- Socket.io rooms are cleaned up on disconnect to reduce memory leaks.
- Prompt templates are versioned constants so AI behavior can change without inline prompt edits.
- Backend modules are separated by service responsibility so the code can be split into microservices later.

## Notes

This starter keeps prompt templates versioned in code, centralizes the API response format, and isolates the backend into service-oriented modules so it can be extracted into microservices later.
