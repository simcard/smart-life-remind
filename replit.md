# SmartRemind

A family reminder management app with authentication, reminders, family sharing, notifications, and location-based features.

## Architecture

**Frontend**: React + TypeScript + Vite (port 5173 in dev)
**Backend**: Express.js + TypeScript (port 5000)
**Database**: Neon Postgres via Drizzle ORM
**Auth**: JWT tokens stored in localStorage (7-day expiry)

## Development

- `npm run dev` — starts both Express server (port 5000) and Vite dev server (port 5173) concurrently
- Replit's webview connects to port 5000; the Express server proxies all non-API requests to the Vite dev server on port 5173
- `npm run db:push` — sync database schema changes

## Key Files

- `server/index.ts` — Express app entry point with proxy setup
- `server/routes/` — API routes: auth, reminders, family, notifications, locations
- `server/middleware/auth.ts` — JWT authentication middleware
- `shared/schema.ts` — Drizzle ORM schema (users, profiles, family_members, reminders, notifications, user_locations)
- `drizzle.config.ts` — Drizzle configuration using DATABASE_URL

## Environment Variables

- `DATABASE_URL` — Neon Postgres connection string (set by Replit)
- `JWT_SECRET` — Secret for JWT signing (falls back to default in dev; set in production)
- `PORT` — Server port (defaults to 5000)
- `NODE_ENV` — Set to "production" for production builds

## API Endpoints

- `POST /api/register` — Register user
- `POST /api/login` — Login user
- `GET/POST /api/reminders` — List/create reminders
- `PUT/DELETE /api/reminders/:id` — Update/delete reminder
- `GET/POST /api/family` — List/add family members
- `DELETE /api/family/:id` — Remove family member
- `GET/POST /api/notifications` — List/create notifications
- `GET/POST /api/locations` — List/update locations

## Database Schema

Tables: `users`, `profiles`, `family_members`, `reminders`, `notifications`, `user_locations`

## Migration Notes

- Migrated from Lovable/Supabase to Replit/Neon Postgres
- Replaced Supabase client with custom REST API (`src/lib/api.ts`)
- Removed lovable-tagger from Vite config
- Switched from `@vitejs/plugin-react-swc` to `@vitejs/plugin-react` v4 (native binding compatibility)
