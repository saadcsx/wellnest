# Wellnest

**Clinical assessments, clearly documented.**

Wellnest is an AI-assisted clinical documentation tool built on the MERN stack. A clinician captures a patient encounter however is fastest — a specialty intake form, free-text notes, or voice dictation — and Wellnest (Uni Project) returns a structured assessment: presenting complaint, history, differential diagnosis, management plan, follow-up and red flags. Patient identifiers never leave the clinician's workspace; only de-identified clinical content is sent for analysis. Assessments are saved to per-user records, searchable, and exportable as print-ready reports.

> **The name.** _Wellnest_ is _wellness_ + _nest_: a safe, organised place where a clinician's assessments and patient records live. Short, warm, easy to say, and it doesn't sound like every other "MedAI" tool.

## Stack

| Layer    | Technology                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Database | **MongoDB** with **Mongoose** ODM (`User`, `Patient`, `CustomForm` models)                                                             |
| API      | **Express** on **Node.js** (TypeScript, ES modules), JWT sessions in httpOnly cookies, bcrypt password hashing, zod request validation |
| Client   | **React 18** with **Vite**, React Router, Tailwind CSS, Radix primitives, react-hook-form + zod, dnd-kit, framer-motion                |
| AI       | Google Gemini (assessment generation), AssemblyAI (dictation transcription)                                                            |

## Features

- **Three capture modes** — specialty forms (Emergency, Cardiology, Paediatrics, Orthopaedics), free text, or voice dictation with an editable transcript
- **Structured AI assessment** — the same report layout every time, whichever input was used
- **Privacy by design** — name, age, sex, arrival time and ID are stripped client-side before analysis
- **Patient records** — saved per clinician, searchable by name / ID / diagnosis, updated in place on re-analysis
- **Custom form builder** — drag-and-drop intake forms for situations the defaults don't cover
- **PDF export** — clean, paginated report for the notes or a referral
- **Account management** — register, sign in, update profile, change password

## Project structure

```
wellnest-mern/
├── client/                 # React + Vite single-page app
│   ├── public/             # fonts, screenshots, favicon
│   └── src/
│       ├── components/     # UI (ui/, landing/, assessment/, form-builder/, …)
│       ├── context/        # AuthContext — session state
│       ├── lib/            # api client, types, sample data, form configs
│       └── pages/          # route components
└── server/                 # Express + Mongoose API
    └── src/
        ├── config/         # env validation, database connection
        ├── models/         # User, Patient, CustomForm
        ├── middleware/     # auth, validation, error handling
        ├── routes/         # auth, patients, custom-forms, analyze, transcribe
        └── services/       # Gemini, AssemblyAI
```

## Getting started

Requirements: Node 18+, and MongoDB (local install or an Atlas connection string).

```bash
npm install                                  # installs both workspaces
cp server/.env.example server/.env           # then fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev                                  # API on :5000, client on :5173
```

Open http://localhost:5173. In development the Vite server proxies `/api/*` to Express, so the session cookie is same-origin.

> Using **MongoDB Atlas** (recommended — no local install): create a free cluster, add a database user, allow your IP under Network Access, and paste the `mongodb+srv://…` connection string as `MONGODB_URI` with `/wellnest` as the database name. Nothing else (no Compass, no local server) is required.
>
> No database at all? Set `MONGODB_URI=memory` to run an in-process MongoDB (downloads a binary on first start; data is discarded on exit).

### Environment variables (`server/.env`)

| Variable                         | Purpose                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `MONGODB_URI`                    | MongoDB connection string, or `memory`                                            |
| `JWT_SECRET`                     | Secret for signing session tokens                                                 |
| `CLIENT_ORIGIN`                  | Origin allowed to call the API with credentials (default `http://localhost:5173`) |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Google Gemini for assessment generation                                           |
| `ASSEMBLYAI_API_KEY`             | AssemblyAI for dictation (optional)                                               |

### Other scripts

```bash
npm run build       # builds client (dist/) and server (dist/)
npm start           # serves the API and, in production, the built client from one origin
npm run typecheck   # both workspaces
npm run lint        # client
```

Under `vite dev`, every input shows a **Sample** button that fills it with realistic, fictional clinical data so the app can be exercised without medical knowledge. Set `VITE_SAMPLE_DATA=true` in `client/.env` to keep it in production builds.

## Hosting

The API and the built client are designed to run from **one origin** (Express serves `client/dist` in production), so the session cookie is first-party and no CORS configuration is needed. MongoDB runs on **Atlas** (free tier).

### Option A — Render (recommended: one service, free tier)

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, pick the repo. Render reads [`render.yaml`](render.yaml) and creates the service.
3. When prompted, paste `MONGODB_URI` (your Atlas `mongodb+srv://…/wellnest?retryWrites=true&w=majority` string), `GEMINI_API_KEY`, and optionally `ASSEMBLYAI_API_KEY`. `JWT_SECRET` is generated for you.
4. In Atlas → **Network Access**, allow `0.0.0.0/0` (Render's outbound IPs change) or add Render's static IPs.

Render runs `npm install && npm run build`, then `npm start`. The app is live at `https://<service>.onrender.com`.

### Option B — Vercel (one project, serverless API)

The Express app is wrapped as a single serverless function in [`api/index.ts`](api/index.ts); [`vercel.json`](vercel.json) routes `/api/*` to it and everything else to the React app.

1. Import the repo in Vercel (framework preset: **Other**; the build settings come from `vercel.json`).
2. Add environment variables: `MONGODB_URI`, `JWT_SECRET` (any long random string), `GEMINI_API_KEY`, `GEMINI_MODEL`, `ASSEMBLYAI_API_KEY`.
3. Deploy. Allow `0.0.0.0/0` in Atlas Network Access.

Limits to know on Vercel: request bodies are capped at 4.5 MB (long dictation uploads may need to be shorter) and a function may run for at most 60 s on the Hobby plan (`maxDuration` in `vercel.json`), which covers Gemini comfortably but can cut off very long AssemblyAI transcriptions. Render has neither limit.

### Option C — split hosting

Client on Vercel/Netlify and API on Render also works, but the session cookie then crosses sites: set `CLIENT_ORIGIN` to the client URL and change the cookie to `sameSite: "none"` in `server/src/utils/jwt.ts`. Option A or B is simpler.

## API

All routes are prefixed with `/api`. Routes marked 🔒 require a session (cookie set by `/auth/login` or `/auth/register`).

| Method   | Route                  | Description                                            |
| -------- | ---------------------- | ------------------------------------------------------ |
| `POST`   | `/auth/register`       | Create an account and start a session                  |
| `POST`   | `/auth/login`          | Sign in                                                |
| `POST`   | `/auth/logout`         | Clear the session cookie                               |
| `GET`    | `/auth/me`             | Current user, or `null`                                |
| `PATCH`  | `/auth/me` 🔒          | Update name and/or password                            |
| `GET`    | `/patients?search=` 🔒 | The clinician's records, newest first                  |
| `POST`   | `/patients` 🔒         | Save an assessment (upsert on `patientId`)             |
| `DELETE` | `/patients/:id` 🔒     | Delete a record                                        |
| `GET`    | `/custom-forms` 🔒     | The clinician's forms                                  |
| `POST`   | `/custom-forms` 🔒     | Create, or update when `id` is present                 |
| `DELETE` | `/custom-forms/:id` 🔒 | Delete a form                                          |
| `POST`   | `/analyze` 🔒          | De-identified clinical content → structured assessment |
| `POST`   | `/transcribe` 🔒       | Multipart `audio` → transcript                         |
| `GET`    | `/health`              | Liveness check                                         |

## Data model

```
User          { name, email (unique), passwordHash, plan: free|premium }
Patient       { user → User, patientId, fullName, age, gender, arrivalDateTime,
                specialty, inputMethod, chiefComplaint, primaryDiagnosis, severity,
                clinicalData, aiAnalysis }            unique (user, patientId)
CustomForm    { user → User, name, description, fields[] }
```

Every patient and form query is scoped by the signed-in user's id; one account can never read another's data.

## Disclaimer

Wellnest supports clinical documentation. It does not replace clinical judgement, and its output must be reviewed by a qualified clinician before use.
