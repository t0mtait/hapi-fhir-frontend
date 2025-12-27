# Stack Tracker (HAPI FHIR Frontend)

A Next.js app for authenticated management of FHIR medication data. Users sign in with Auth0, are mirrored into PostgreSQL and HAPI FHIR, and can browse medications, add them to a personal medication stack (creates MedicationStatements), or create/delete medications. The repo now ships with Docker Compose for a one-command spin-up of the entire stack (web + HAPI FHIR + Postgres).

## Features

- Auth0 sign-in with automatic user sync into PostgreSQL and a corresponding FHIR Patient
- Medication browser (pulls Medications from HAPI FHIR) with delete and “Add to Stack” actions
- Medication stack on the dashboard (MedicationStatements linked to the logged-in patient)
- Admin-only user table (guarded via stored `roles` array) and resource creation UI
- Dark/light ready UI built with Flowbite React + Tailwind CSS 4
- Dockerized stack: Next.js app, HAPI FHIR server, and Postgres in one compose file

## Tech Stack

- Next.js 15 (App Router) • React 19 • TypeScript 5
- Auth0 SPA SDK
- PostgreSQL via `pg`
- HAPI FHIR R4 server (hapiproject/hapi) with Postgres backing store
- Tailwind CSS 4 + Flowbite React
- ESLint + Prettier

## Prerequisites

- Node.js 18+ (for local dev)
- Docker + Docker Compose (recommended path)
- Auth0 application configured for SPA

## Run with Docker Compose (recommended)

1. Create `.env.local` in the repo root. For the compose network, these defaults work:
   ```bash
   NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id

   DB_HOST=db
   DB_PORT=5432
   DB_NAME=hapi
   DB_USER=admin
   DB_PASSWORD=admin

   FHIR_BASE_URL=http://fhir:8080/fhir
   ```
2. Start everything: `docker compose up --build`
3. Open http://localhost:3000 and log in. HAPI FHIR is exposed on http://localhost:8080/fhir and Postgres on localhost:5432 (credentials above) if you want to inspect data.

## Local Development (without containers)

1. Install deps: `npm install`
2. Create `.env.local` using your local services, e.g.:
   ```bash
   NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hapi
   DB_USER=admin
   DB_PASSWORD=admin
   FHIR_BASE_URL=http://localhost:8080/fhir
   ```
3. Run dev server: `npm run dev`
4. Production build: `npm run build` then `npm start`

## App Anatomy

- Dashboard: shows welcome, cards for Users/Resources/Create (admin-gated), and the medication stack table
- Resources: lists Medications from FHIR with view/delete/add-to-stack actions
- Create Resource: simple Medication creator that posts to FHIR
- Users: admin view of `app_user` records (email filter is supported via `?email=`)
- Stack: renders MedicationStatements for the logged-in patient

## API Surface

- `GET /api/users` — list users; `?email=` filters by email and returns count
- `POST /api/users` — creates a user, also creates a FHIR Patient; expects `username`, `email`, `auth0_id`, optional `roles`, `profile_info`
- `POST /api/users/sync` — invoked by Auth0 login flow; upserts user and Patient with default roles `['user']`
- `GET /api/resources` — fetches Medications (FHIR `Medication?_count=50`)
- `POST /api/createresource` — create any FHIR resource; body must include `resourceType`
- `DELETE /api/deleteresource` — delete FHIR resource; body `{ resourceType, id }`
- `GET /api/medicationstatement` — list MedicationStatements (user stack view)
- `POST /api/stack` — create a MedicationStatement tied to the current user (looks up `fhir_patient_id` via email header and references the selected Medication)

## Notes on Roles and Auth

- Auth0 SPA SDK manages login; environment keys are required or the app renders a helpful setup screen
- Admin-only UI depends on `roles` stored in `app_user`; the admin card appears when `roles` includes `admin`

## Troubleshooting

- Missing Auth0 config: ensure `NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID` exist in `.env.local` and restart
- FHIR errors: confirm `FHIR_BASE_URL` matches the running server (compose uses `http://fhir:8080/fhir`)
- DB errors: verify Postgres is reachable with the same host/port/credentials as `.env.local`; in compose the service is `db`

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm start` — run the standalone server output
- `npm run lint` — ESLint
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check

## License

Academic assignment; see repository for details.
