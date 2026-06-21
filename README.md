This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Backend

Scholar Grid has a real backend now: Next.js Route Handlers (`app/api/.../route.ts`) backed by a SQLite database (via `better-sqlite3`). No separate server process — it all runs inside `next dev` / `next start`.

### Setup (first time)

```bash
npm install
npm run db:seed   # creates app/data/scholargrid.db and fills it with demo content
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and log in with one of the seeded accounts (or sign up for a new one — signup works for real now too):

| Email | Password | Role |
|---|---|---|
| `vcruz@demo.scholargrid.com` | `password123` | student |
| `dramirez@demo.scholargrid.com` | `password123` | creator |
| `sherrera@demo.scholargrid.com` | `password123` | creator |

`npm run db:seed` is safe to re-run any time — it wipes all tables and reloads the demo data, so it's an easy way to reset to a clean state.

### How it's wired together

- **Database**: `app/lib/db.ts` opens a single SQLite connection (`app/data/scholargrid.db`, created automatically) and creates all tables on first import if they don't already exist. No separate migration step needed for this project's scope.
- **Auth**: `app/lib/auth.ts`. Passwords are hashed with bcrypt (`bcryptjs`) before being stored — plaintext passwords never touch the database. On login/signup we generate a random 32-byte session token, store only its SHA-256 hash in a `sessions` table, and send the raw token to the browser in an `httpOnly` cookie (`sg_session`). Every API route that needs to know who's calling reads that cookie, hashes it, and looks it up — so a leaked database doesn't hand out usable sessions any more than it hands out usable passwords.
- **API routes**: under `app/api/`, one folder per resource (`auth/`, `posts/`, `todos/`, `user/`, `activity/`). Routes that mutate data require a valid session and return `401` otherwise.
- **Frontend**: `app/context/AppContext.tsx` now calls these routes with `fetch(..., { credentials: "include" })` instead of writing straight to `localStorage`. `localStorage` is still used as an offline-friendly snapshot for instant repaint on reload, but the database (via the API) is the actual source of truth — every mutation goes to the server first.

### Environment variables

None are required to run this locally — session tokens are random and only ever compared by their hash, so there's no shared secret to configure. If you deploy this somewhere with HTTPS, the session cookie automatically gets the `Secure` flag when `NODE_ENV=production`.

### Resetting the database

Just delete the SQLite file and re-seed:

```bash
rm app/data/scholargrid.db app/data/scholargrid.db-shm app/data/scholargrid.db-wal
npm run db:seed
```

### Scope notes

Per the assignment brief, this intentionally **doesn't** include: real file uploads/storage (post attachments are still metadata-only, matching the original UI), real payment processing (the PayPal modal still just marks a post as "purchased"), OAuth (the Google/Microsoft buttons are decorative), email verification, password reset, rate limiting, or role-based middleware beyond "are you logged in." The `users.role` column exists (student/creator/moderator) and is used for the profile badge, but there's no moderator-only enforcement anywhere — that was explicitly out of scope.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
