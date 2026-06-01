# RickshareBD — Non-Technical Deployment Guide

> **What this file is:** A plain-English record of everything that was done to take Rickshare from a "fake demo" on your laptop to a real, working website on the internet. You do not need to understand code to read this.

---

## 1. The Problem We Solved

**Before:**
- Rickshare was a beautiful-looking demo on your computer (`localhost:3000`).
- All ride posts, join requests, and ratings were stored in **pretend memory** (a JavaScript file).
- If you refreshed the page, everything reset to the same 3 fake rides.
- Two different people visiting the site could not see each other’s posts.
- Deploying it to the internet would have meant every visitor saw the exact same fake data, and nothing ever saved.

**After:**
- Rickshare is a real website hosted on **Vercel**.
- Data lives in a real **PostgreSQL database** (provided by Neon through Vercel).
- When someone posts a ride, it actually saves. When someone joins, it actually saves. Refresh the page — it’s still there.
- Multiple people can use it at the same time.

---

## 2. Big Decisions (and Why)

| Decision | What it means | Why we chose it |
|---|---|---|
| **Host: Vercel** | The website lives on Vercel’s servers | Next.js (our framework) is made by Vercel. It’s free, fast, and one-click deploy. |
| **Database: Neon PostgreSQL** | A real SQL database that stores tables of rides, users, and requests | Vercel has a built-in integration. Free tier is generous. Works perfectly with serverless websites. |
| **Tool: Prisma** | A "translator" that lets the code talk to the database in clean, safe TypeScript | Prevents bugs. Makes the code readable. Generates types automatically. |
| **No auth for MVP** | We did not add login/passwords yet | Keeps the MVP simple. Anyone can post or join. Trust is shown through ratings and safety tags only. |

---

## 3. What Was Changed (Step by Step)

### Step A — Install Prisma (the database translator)

We added four new packages to the project:
- `prisma` — the engine that talks to the database
- `@prisma/client` — the clean TypeScript interface our code uses
- `pg` — the official PostgreSQL driver that connects to the database
- `tsx` — a helper to run the database seed script

**Why this matters:** Before, the app had a file called `rickshare-data.ts` with fake arrays. After this step, the app gained a `prisma/schema.prisma` file that defines what a "Ride" and a "JoinRequest" actually look like in the real database.

### Step B — Design the database tables

We defined three tables:

1. **RidePost** — stores every ride someone posts
   - ID, poster name, rating, pickup location, destination, time, fare, open seats, status, notes, route match info, safety tag

2. **JoinRequest** — stores every "can I join?" message
   - ID, which ride it belongs to, requester name, rating, status (pending/accepted/rejected), message

3. **Rating** — stores co-passenger ratings
   - ID, ride ID, score, note

We also added relationships so a Ride can have many JoinRequests, and Prisma handles the linking automatically.

### Step C — Replace the fake data layer

The file `src/lib/rickshare-data.ts` was completely rewritten.

**Before:** It exported hardcoded arrays like `ridePosts = [ {...}, {...} ]`.
**After:** It exports helper functions that call the real database:
- `getAllRides()` → asks the database for all rides
- `getRideById(id)` → asks for one specific ride
- `getRequestsForRide(rideId)` → asks for all join requests on a ride
- `createRide(data)` → inserts a new ride into the database
- `createJoinRequest(data)` → inserts a new join request
- `updateJoinRequest(id, status)` → accepts or rejects a request

**Why this matters:** Every page and API route now reads from and writes to a real database instead of pretend arrays.

### Step D — Update the API routes

The app has "API routes" — these are the behind-the-scenes endpoints the front end calls to save/load data.

**Before:** They returned hardcoded mock responses.
**After:** They use Prisma to actually query the database.

| API Route | What it does now |
|---|---|
| `GET /api/rides` | Returns all real rides from the database |
| `POST /api/rides` | Takes form data, creates a real ride row |
| `GET /api/rides/[id]` | Returns one ride + its linked join requests |
| `PATCH /api/rides/[id]` | Updates a ride’s status |
| `PATCH /api/join-requests/[id]` | Updates a request to accepted or rejected |
| `POST /api/ratings` | Creates a real rating row |

### Step E — Wire the frontend forms

**Before:** The "Post Ride" form and "Join Request" forms looked real, but clicking the button did nothing (the buttons were set to `type="button"` with no action).

**After:**
- **Post Ride page** (`/post-ride`) now has a real form that `POST`s to `/api/rides`, then redirects you to the new ride.
- **Ride Details page** (`/rides/[id]`) now has a working join request form that `POST`s to `/api/rides/[id]/join-requests`.
- **Accept/Reject buttons** on the ride details page now call `PATCH /api/join-requests/[id]` and refresh the page to show the new status.

**Why this matters:** The website is no longer a slideshow. It is an interactive application.

### Step F — Seed the database

We added a seed script (`prisma/seed.ts`) that populates the database with the same three starter rides and one join request from the original demo.

**Why this matters:** When the database is brand new and empty, running the seed gives you realistic sample data so the homepage and browse page look good immediately.

### Step G — Vercel deployment setup

We added configuration files and environment variable support:
- `DATABASE_URL` — a secret connection string that tells the app where the database lives (you will paste this from Vercel later).

**Why this matters:** On your laptop, the app can connect to a local database. On Vercel, it needs the real internet address of your Neon database. Environment variables keep that address secret.

---

## 4. How to Deploy (Your Action Items)

These are the steps a non-technical person can follow to get the live site running.

### 4.1. Create a Vercel account
1. Go to [vercel.com](https://vercel.com) and sign up (free).
2. Connect your GitHub account when asked.

### 4.2. Create a Neon database inside Vercel
1. In the Vercel dashboard, go to **Storage**.
2. Click **Create Database** and choose **Neon**.
3. Select your Rickshare project, region (choose one close to you, e.g., `ap-south-1` for Bangladesh/Asia), and create it.
4. Vercel will automatically add a `DATABASE_URL` environment variable to your project.

### 4.3. Push the code to GitHub
1. Make sure all changes are committed to Git:
   - `git add .`
   - `git commit -m "Add Prisma database and wire all APIs"`
2. Push to GitHub:
   - `git push origin main` (or `master`)

### 4.4. Import the project into Vercel
1. In Vercel dashboard, click **Add New Project**.
2. Choose your GitHub repository (`RickshareBD`).
3. Vercel will auto-detect it as a Next.js app.
4. Make sure the environment variables from the Neon step are present.
5. Click **Deploy**.

### 4.5. Seed the database (first time only)
After the first deploy, you need to put the starter data into the live database:

1. In Vercel dashboard, go to your project → **Settings** → **Environment Variables**.
2. Copy the value of `DATABASE_URL`.
3. Open a terminal on your computer and run:
   ```bash
   npx prisma db seed
   ```
   (This uses your local code but talks to the live database.)

   Or, if you want to run migrations and seed on Vercel directly, add a build script that runs `prisma migrate deploy` before building.

### 4.6. Check your live site
- Vercel will give you a URL like `https://ricksharebd.vercel.app`.
- Open it. You should see the Rickshare homepage.
- Post a ride, refresh the page — it should still be there.

---

## 5. File-by-File Changes (Summary)

| File | What changed |
|---|---|
| `prisma/schema.prisma` | **New.** Defines the database tables (RidePost, JoinRequest, Rating). |
| `prisma/seed.ts` | **New.** Script that fills the database with starter data. |
| `src/lib/rickshare-data.ts` | **Rewritten.** Now exports database helper functions instead of fake arrays. |
| `src/app/api/rides/route.ts` | **Updated.** `GET` and `POST` now query the real database via Prisma. |
| `src/app/api/rides/[id]/route.ts` | **Updated.** `GET` and `PATCH` now query the real database. |
| `src/app/api/join-requests/[id]/route.ts` | **Updated.** `PATCH` now updates the real database. |
| `src/app/api/ratings/route.ts` | **Updated.** `POST` now creates a real rating row. |
| `src/app/api/rides/[id]/join-requests/route.ts` | **New.** Handles creating join requests for a specific ride. |
| `src/app/post-ride/page.tsx` | **Updated.** Form now submits to the API and redirects. |
| `src/app/rides/[id]/page.tsx` | **Updated.** Join request form and accept/reject buttons now work. |
| `src/app/rides/page.tsx` | **Minor update.** Now fetches from database instead of mock import. |
| `src/app/admin/page.tsx` | **Minor update.** Now fetches from database instead of mock import. |
| `src/app/page.tsx` | **Minor update.** Now fetches from database instead of mock import. |
| `package.json` | **Updated.** Added Prisma, PostgreSQL driver, and seed script command. |
| `.env.example` | **New.** Template showing what environment variables are needed. |
| `NON-TECH-DEPLOY.md` | **This file.** Documentation for non-technical readers. |

---

## 6. Known Limitations of the MVP

These are intentional choices to keep the first version simple:

- **No user accounts or login.** Anyone can post or join. Names are typed freely.
- **No real-time updates.** If two people are on the site, they must refresh to see new posts.
- **No map integration.** Locations are typed as text (e.g., "Dhanmondi 27"), not GPS pins.
- **No in-app payment.** The app only shows "split fare guidance." Riders exchange cash in person.
- **No notification system.** Posters must check the site to see new join requests.

---

## 7. If Something Goes Wrong

| Symptom | Likely cause | Quick fix |
|---|---|---|
| Site shows "Internal Server Error" | Database URL is missing or wrong | Check Vercel Environment Variables → `DATABASE_URL` |
| Empty ride list | Database is empty, seed not run | Run `npx prisma db seed` locally with live DB URL |
| Form submits but nothing changes | API route error | Check Vercel dashboard → **Logs** for error messages |
| Build fails on Vercel | Prisma client not generated | Make sure `prisma generate` is in the build step or postinstall |

---

## 8. Glossary (Non-Tech Terms)

| Term | Simple meaning |
|---|---|
| **Database** | A digital filing cabinet that stores information permanently |
| **PostgreSQL** | A popular, reliable brand of database |
| **Neon** | A company that provides PostgreSQL databases designed for Vercel |
| **Prisma** | A helper tool that makes talking to the database easier and safer |
| **API Route** | A behind-the-scenes web address the website uses to save/load data |
| **Serverless** | Vercel runs the code only when someone visits the site — no always-on server |
| **Environment Variable** | A secret setting (like a password) that the app reads but never shows publicly |
| **Seed** | Pre-loading sample data into an empty database so it looks realistic |

---

*Document created by OpenCode during deployment migration.*
*Last updated: June 2026*
