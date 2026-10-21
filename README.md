# Refrain: recovery-support platform

React + Vite client, Node/Express API, Socket.IO realtime, Firebase Auth, MongoDB.

## Run
1. Firebase console: create a project, enable Email/Password auth, create a service account key.
2. `cd server && cp .env.example .env`, fill it in, then `npm i && npm run dev`
3. `cd client && cp .env.example .env`, fill it in, then `npm i && npm run dev`

## Architecture
- Auth: Firebase ID token on every REST call and on the socket handshake, verified with firebase-admin.
- Data: MongoDB. Journal notes are AES-256-GCM encrypted before they reach the database.
- Risk engine (`server/src/services/risk.js`): weighted signal score, compared against the user's own 14-day baseline, with a rising-trend early warning.
- Insights (`routes/insights.js`): MongoDB aggregation pipelines for daily trend, triggers, sleep-craving link.
- Community: anonymous handles derived from a hash of the uid, per-socket rate limit, 30-day message TTL.
- Hardening: helmet, CORS allow-list, express-rate-limit, zod validation.

## Before real users
Add moderation/reporting for chat, a privacy policy, data export and delete endpoints, and clinical review of the advice copy. This is a self-tracking aid, not medical care.
