<!-- # Phase 0 — Foundation & Cleanup

**Status:** 🟡 In progress
**Goal:** get the project into a clean state where it installs, builds, runs, and can
talk to the database. **No new features yet** — we're removing landmines so every later
phase stands on solid ground.

> 👋 **Beginner note:** Take these one box at a time. After each task, run the app
> (`npm run dev`) and check it still loads at <http://localhost:3000>. If something
> breaks, stop and check [`troubleshooting.md`](./troubleshooting.md) before moving on —
> don't pile the next change on top of a broken one.

> 📄 **Guide files:** Some tasks below point you to a *guide file* (a `.txt` file in this
> same folder). These are **explained code written in plain English** — open the guide,
> read every line, and **type the real code yourself** into the file it names. Read
> [`readme.md`](./readme.md) once before you start so you know how they work.

---

## What you'll learn in this phase

- What `npm install` does and why `node_modules` isn't in git
- How Next.js decides which folder is your app (`app/` vs `src/app/`)
- What a Next.js **page** file must export to work
- What environment variables are and why secrets live in `.env`
- What a database **migration** is and what `prisma generate` produces

Concepts are explained inline as you hit them.

---

## Before you start: read these (15–20 min)

1. **The project rule.** Open [`AGENTS.md`](../../AGENTS.md). It says this is a *modified*
   Next.js — always check `node_modules/next/dist/docs/` before coding. You can only do
   that **after** Task 1 (install) below.
2. Skim, don't memorize:
   - Next.js App Router — Pages & Layouts: <https://nextjs.org/docs/app/getting-started/layouts-and-pages>
   - Prisma — Getting started with an existing project: <https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project>

---

## Tasks

Work top to bottom. Tick a box by changing `- [ ]` to `- [x]`.

### 1. Install dependencies
- [x] Run `npm install` in the project root.
- [x] Confirm a `node_modules/` folder appeared and there are **no red errors** at the end.

**Why:** the project lists its libraries in `package.json`, but the actual library code
lives in `node_modules/`, which is **not** committed to git (see `.gitignore`). Until you
install, nothing can run.

**Check it worked:**
```bash
npm run dev
```
Open <http://localhost:3000>. You should see the BookEase landing page. Press `Ctrl+C` to stop.

> If `npm install` fails, copy the full error to the reviewer before continuing.

---

### 2. Read the mandated Next.js docs (now that they exist)
- [x] List what's available: `ls node_modules/next/dist/docs/`
- [x] Open the guide most relevant to **pages/routing** and skim it.
- [x] Note (in your own words, in the "Notes" section at the bottom) anything that
      differs from the public tutorials — especially **deprecation notices**.

**Why:** `AGENTS.md` requires this. Different Next.js versions change APIs; we don't want
to write code against the wrong one.

---

### 3. Remove the duplicate `src/` directory (dead code)
Right now the project has **two** app folders:

```
app/          ← the REAL one Next.js uses
src/app/      ← dead copies (older, half-commented). Next.js ignores these.
```

Because a root `app/` folder exists, Next.js never looks in `src/`. Those files are a
trap — someone will eventually edit `src/app/page.tsx` and wonder why nothing changes.

- [x] Confirm the real app is the root one: `app/page.tsx` is the landing page you saw in the browser.
- [x] Delete the entire `src/` directory:

```bash
rm -rf src
```

- [x] Run `npm run dev` again — landing page still loads, no new errors.

**Why one folder:** Next.js supports *either* `app/` at the root *or* `src/app/`, not both
at once. Mixing them creates confusion and dead code. We're standardizing on root `app/`.

> ℹ️ You don't need to rescue anything from `src/` first. The old `src/app/book/page.tsx`
> had a booking form, but Task 4's guide (`book-page.txt`) gives you the full page from
> scratch — so it's safe to delete `src/` now.

---

### 4. Fix the empty booking page
**File to edit:** `app/book/page.tsx` (it currently exists but is **0 bytes / empty**).
Visiting `/book` crashes because a Next.js page file **must have a default export** — a
React component to render.

**👉 Open the guide file [`book-page.txt`](./book-page.txt) and follow it step by step.**
It walks you through exactly what to type, with the "why" behind each part.

- [x] Read `book-page.txt` top to bottom.
- [x] Type the page component into `app/book/page.tsx` (a heading + a static form).
- [x] Make sure the file has `export default function BookPage() { ... }`.

**The short version of what you're writing:**
```tsx
// app/book/page.tsx
export default function BookPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Book an Appointment</h1>
      {/* a few <input> fields + a button — full details in book-page.txt */}
    </main>
  );
}
```

**Why this matters:** in the App Router, a folder under `app/` becomes a URL, and its
`page.tsx` is what renders there (`app/book/page.tsx` → `/book`). Next.js renders the
file's **default export**, so without `export default` the route errors. You write the
component once here and Next.js reuses it every time someone visits `/book`.

**Check it worked:** run `npm run dev` and visit <http://localhost:3000/book>. You should
see the page with no error. (The button does nothing yet — wiring it up is Phase 3.)

---

### 5. Connect the database (environment variables)
The app uses a Neon Postgres database (see the `.neon` file). Prisma reads the connection
string from an environment variable called `DATABASE_URL`. There is no `.env` file yet, so
every database call currently fails.

**👉 First time setting up a database? Follow the full walkthrough
[`neon-setup.md`](./neon-setup.md)** — it takes you from zero to a working `DATABASE_URL`,
step by step. Then use [`env-example.txt`](./env-example.txt), which explains the
connection string piece by piece.

- [x] Get a Neon database and connection string — see [`neon-setup.md`](./neon-setup.md).
- [x] Create a file named exactly `.env` in the project root (same folder as `package.json`).
- [x] Put one line in it (replace the placeholder with your **real** Neon value):
```bash
# .env  (git-ignored — never commit real secrets)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```
- [x] Get the real value from your Neon dashboard (Connection Details → connection string).
      If you don't have access, ask the reviewer.
- [x] Run `git status` and confirm `.env` does **not** appear in the list.

**Why `.env`:** secrets (passwords, API keys) must **never** be committed to git. Look at
`.gitignore` — it already ignores `.env*`. The app reads this value at runtime via
`process.env.DATABASE_URL`, which is exactly what `prisma.config.ts` and
`prisma/schema.prisma` reference as `env("DATABASE_URL")`.

> ⚠️ Do **not** paste the real connection string into chat, a commit, or this doc.

---

### 6. Create the database tables (first migration)
Your Prisma **schema** (`prisma/schema.prisma`) describes the tables you *want*. A
**migration** is the step that actually creates them in the real database.

- [x] Run the first migration:
```bash
npx prisma migrate dev --name init
```
- [ x] Generate the Prisma client (often runs automatically with the line above, but run
      it to be sure):
```bash
npx prisma generate
```
- [x] Confirm a `prisma/migrations/` folder now exists with an `init` migration inside.

**Check it worked — look at your tables:**
```bash
npx prisma studio
```
This opens a browser UI. You should see empty `User` and `Appointment` tables. 🎉

> 🧠 **Concept — schema vs migration vs client:**
> - **Schema** = your blueprint (what tables/columns should exist).
> - **Migration** = the SQL that changes the real database to match the blueprint.
> - **Client** = auto‑generated TypeScript code (in `app/generated/prisma`) that lets
>   your app run type‑safe queries like `prisma.user.findUnique(...)`.

---

### 7. Quick cleanups
**File to edit:** `app/layout.tsx`. **👉 Follow the guide
[`layout-metadata.txt`](./layout-metadata.txt).**

- [x] **Page title:** in `app/layout.tsx`, the `metadata` object still says
      *"Create Next App"*. Change `title` and `description` to real BookEase text.
- [x] **Stray file:** delete the duplicate `app/favicon1.ico` (keep `app/favicon.ico`):
      `rm app/favicon1.ico`

**What you're changing it to:**
```tsx
// app/layout.tsx  — edit only these two lines inside the existing metadata object
export const metadata: Metadata = {
  title: "BookEase — Appointment Booking",
  description: "Schedule and manage appointments online.",
};
```

**Why:** `metadata.title` is what shows on the browser tab (and in search results / link
previews). The default "Create Next App" is a leftover from the project template — every
real app should set its own.

---

### 8. Final verification
- [x] `npm run build` completes with **no errors**.
- [x] `npm run dev` runs; these all load without crashing:
      `/` (landing), `/book`, `/dashboard`.
- [x] `npx prisma studio` shows the `User` and `Appointment` tables.

When all boxes above are ticked, **stop and ask for a review.** Don't start Phase 1 yet.

---

## ✅ Definition of done (what the reviewer will check)

- [x] `node_modules` installed; `npm run build` passes cleanly
- [x] `src/` directory is gone; only root `app/` remains
- [x] `app/book/page.tsx` renders a page (has a default export)
- [x] `.env` exists locally with `DATABASE_URL` (and is **not** committed)
- [x] `prisma/migrations/` exists; Prisma Studio shows both tables
- [x] `app/layout.tsx` metadata updated; `favicon1.ico` removed
- [x] All three routes load in the browser without errors

---

## Common mistakes to avoid

- **Committing `.env`.** Run `git status` before committing — `.env` should **not** appear.
- **Editing files under `src/` by accident.** After Task 3 it's deleted; if you still see
  it, you're in the wrong folder.
- **Skipping `prisma generate`.** Without it, `import { prisma }` works but queries fail
  with "client not generated" errors.
- **Piling changes on a broken state.** Re‑run `npm run dev` after each task.

---

## Notes (fill this in as you go)

> Write down anything surprising, any errors you hit and how you fixed them, and the
> deprecation notes from Task 2. This helps the review go faster.

-
-
-

---

## Resources

- npm — about `node_modules` & `package.json`: <https://docs.npmjs.com/cli/v10/configuring-npm/folders>
- Next.js — Project structure: <https://nextjs.org/docs/app/getting-started/project-structure>
- Next.js — Pages and Layouts: <https://nextjs.org/docs/app/getting-started/layouts-and-pages>
- Next.js — Environment variables: <https://nextjs.org/docs/app/guides/environment-variables>
- Prisma — `migrate dev`: <https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production>
- Prisma — Prisma Studio: <https://www.prisma.io/docs/orm/tools/prisma-studio>
- Neon — connection strings: <https://neon.tech/docs/connect/connect-from-any-app> -->



<!-- # Phase 1 — Data Model & Database

**Status:** 🟡 In progress
**Goal:** understand the schema deeply, practice the migration workflow with one real
change, and seed realistic sample data you can see and query.

> 👋 **Beginner note:** the *understanding* tasks (1 & 2) matter as much as the typing
> tasks. Don't skip them — they make everything later click. After each task, check the
> result before moving on. Stuck? See [`troubleshooting.md`](./troubleshooting.md).

> 📌 **From Phase 0 (please tidy first):** fill in your empty Phase 0 Notes, and decide
> what to do with the duplicate `foundation.md` at the project root. See
> [`STUDENT-START-HERE.md`](./STUDENT-START-HERE.md) for details.

---

## What you'll learn in this phase

- How to **read** a Prisma schema fluently (models, fields, types, relations, enums)
- What a **migration** is and the everyday workflow: *change schema → migrate → commit*
- Why `@updatedAt` exists and how Prisma manages timestamps
- How to **seed** a database and how `create` + nested relations work
- How to **inspect and query** data with Prisma Studio

---

## Tasks

Work top to bottom. Tick a box by changing `- [ ]` to `- [x]`.

### 1. Understand the schema (reading — no code)
**👉 Open [`schema-guide.md`](./schema-guide.md)** and read it with `prisma/schema.prisma`
open beside it.

- [X] Read the whole guide.
- [X] Answer the 5 "self-check" questions at the end **in your Notes section** (bottom of
      this file). Writing them out is how you prove (to yourself) that you understood.

**Why:** every later feature reads/writes this database. Ten minutes of real understanding
now saves hours of confusion later.

---

### 2. Make sure your database matches the schema
Before changing anything, confirm your local setup is healthy.

- [X] Run `npx prisma studio` — it should open and show empty `User` and `Appointment`
      tables (you haven't seeded yet).
- [X] If Studio can't connect, fix `.env` first (see [`troubleshooting.md`](./troubleshooting.md)).

**Why:** you want a known-good starting point so that if something breaks in Task 3, you
know it was *your* change — not a pre-existing problem.

---

### 3. Make a schema change + create a migration
You'll add an `updatedAt` field to **both** models. This is a small, genuinely useful
change — and the point is to practise the **migration workflow** end to end.

**File to edit:** `prisma/schema.prisma`. Add this line to **both** `User` and
`Appointment` (a good spot is right after their `createdAt` line):

```prisma
updatedAt DateTime @updatedAt
```

So `User` ends like:
```prisma
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```
…and do the same inside `Appointment`.

- [X] Add `updatedAt DateTime @updatedAt` to `User`
- [X] Add `updatedAt DateTime @updatedAt` to `Appointment`
- [X] Create the migration:
```bash
npx prisma migrate dev --name add_updated_at
```
- [ ] Confirm a **new** folder appeared under `prisma/migrations/` (e.g.
      `..._add_updated_at/`), then commit it:
```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "Add updatedAt to User and Appointment"
```

**Why `@updatedAt`:** Prisma automatically sets this field to the current time **every time
a row is updated** (and on create). You never set it by hand. It's the standard way to
track "when was this last changed" — useful for sorting and debugging.

**Why migrate *now*, before seeding:** `updatedAt` is a required column. Adding a required
column to a table is only safe while the table is **empty** (no existing rows to leave
without a value). Your tables are empty right now, so this is the safe moment. (A neat
real-world lesson about required columns.)

> 🧠 **The migration workflow, in one line:** edit `schema.prisma` → run
> `prisma migrate dev --name <something>` → Prisma writes the SQL, applies it, and
> regenerates the client → you commit the migration. You'll repeat this every time the data
> model changes.

---

### 4. Seed the database with sample data
Now fill the empty tables with predictable demo data.

**4a. Install the TypeScript runner** (lets us run a `.ts` script directly):
```bash
npm install -D tsx
```
*Why:* `prisma/seed.ts` is TypeScript. `tsx` runs TypeScript files without a separate
build step.

**4b. Tell Prisma how to seed.** **File to edit:** `prisma.config.ts`. Add a `seed` line
inside the existing `migrations` block:
```ts
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
```
*Why:* `npx prisma db seed` looks here to know *which command* runs your seed script.

**4c. Write the seed script.** **👉 Open [`seed-script.txt`](./seed-script.txt)** and follow
it to create **`prisma/seed.ts`**.
- [ ] `prisma/seed.ts` created (an admin + a customer with 2 appointments)

**4d. Run the seed:**
```bash
npx prisma db seed
```
- [ ] You see the "✅ Seeded users…" message with no errors.

**4e. Commit your work:**
```bash
git add prisma/seed.ts prisma.config.ts package.json package-lock.json
git commit -m "Add database seed script with sample data"
```

---

### 5. Inspect and query your data
- [X] Run `npx prisma studio`.
- [X] Open the **User** table — you should see Ada (ADMIN) and Charlie (CUSTOMER).
- [X] Open the **Appointment** table — you should see Charlie's 2 appointments.
- [X] Click into Charlie and confirm his appointments are linked to him (the relation works).
- [X] **Prove the seed is re-runnable:** run `npx prisma db seed` again. It should succeed
      (no "email already exists" error) because the script wipes the tables first.

**Why:** Studio is your window into the database. Being able to *see* your data — and how
relations connect rows — is a core skill for the rest of the project.

---

## ✅ Definition of done (what the reviewer will check)

- [X] You can explain the schema (your 5 self-check answers are in Notes)
- [X] `User` and `Appointment` both have `updatedAt DateTime @updatedAt`
- [X] A new `..._add_updated_at` migration exists and is committed
- [X] `prisma/seed.ts` exists and `npx prisma db seed` runs cleanly (and is re-runnable)
- [X] `prisma.config.ts` has the `seed` command; `tsx` is in `devDependencies`
- [X] Prisma Studio shows the seeded users and linked appointments
- [X] `npm run build` still passes
- [X] Notes section filled in

When everything's ticked, **stop and ask for a review.** Don't start Phase 2.

---

## Common mistakes to avoid

- **Seeding before migrating.** Do Task 3 (migrate) before Task 4 (seed) — see the "why"
  in Task 3.
- **Forgetting to commit the migration folder.** The `prisma/migrations/...` folder is part
  of your project history — always commit it.
- **Storing a real password.** The seed hashes the password with bcrypt — never store plain
  text.
- **Deleting users before their appointments.** The seed deletes appointments first because
  of the foreign key. If you reverse it, you'll get a constraint error.

---

## Notes (fill this in as you go)

> Your 5 self-check answers from Task 1, plus anything surprising and any errors you hit
> and how you fixed them.

**Schema self-check answers:**
1.Email is unique, while phone is just a required string and doesn't have to be unique.
2.Notes is optonal, appointmentDate is required (always must have a value).
3.UserId is foreign key pointing to user.Id
4.Appoinment is not a real DB column, it's a relation.
5.Passwords are hashed strings not plain text.

**Other notes:**
-
-

---

## Resources

- Prisma — Migrations (`migrate dev`): <https://www.prisma.io/docs/orm/prisma-migrate/getting-started>
- Prisma — `@updatedAt`: <https://www.prisma.io/docs/orm/reference/prisma-schema-reference#updatedat>
- Prisma — Seeding: <https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding>
- Prisma — CRUD (`create`, nested writes): <https://www.prisma.io/docs/orm/prisma-client/queries/crud>
- Prisma — Studio: <https://www.prisma.io/docs/orm/tools/prisma-studio> -->



<!-- # Phase 2 — Authentication & Roles

**Status:** 🟡 In progress
**Goal:** users can sign up, log in, and log out; `/book` and `/dashboard` are protected;
and only an **ADMIN** can open the dashboard.

> 👋 **Beginner note:** this phase is bigger than the others, so it's split into **4 Parts
> (A–D)**. Do **one Part at a time** and run its "✅ Test this Part" step before moving on.
> If a Part's test fails, fix it before continuing — auth files depend on each other.

> 📚 **Read [`auth-concepts.md`](./auth-concepts.md) first** if you haven't. The code below
> will make much more sense.

---

## What you'll learn
- How password login works with NextAuth (credentials + JWT sessions)
- How to hash & verify passwords, and why we never store plain text
- How to protect pages with middleware and check roles on the server
- The Next.js "client component" and "provider" patterns

---

# Part A — The auth engine ⚙️

This Part sets up the machinery. Nothing visible yet — but it's the foundation.

### A1. Add two secrets to `.env`
Open your `.env` and add these two lines:
```bash
NEXTAUTH_SECRET="paste-a-long-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```
Generate a real secret (works on Windows, Mac, Linux) and paste its output as the value:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
- [x] `.env` has `NEXTAUTH_SECRET` (a long random value) and `NEXTAUTH_URL`

**Why:** `NEXTAUTH_SECRET` is used to **sign** the login token so it can't be faked.
`NEXTAUTH_URL` tells NextAuth where your app lives. (Both stay out of git — `.env` is ignored.)

### A2. Create the auth config
**👉 Follow [`auth-config.txt`](./auth-config.txt)** to create **`lib/auth.ts`**.
- [x] `lib/auth.ts` created

### A3. Add the TypeScript types
**👉 Follow [`auth-types.txt`](./auth-types.txt)** to create **`types/next-auth.d.ts`**
(create the `types/` folder at the project root).
- [x] `types/next-auth.d.ts` created

### A4. Create the NextAuth route
Create the file **`app/api/auth/[...nextauth]/route.ts`** (yes, the folder name includes the
square brackets). Type this:
```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```
- [x] File created

**Why the weird `[...nextauth]` name:** it's a **catch-all route**. NextAuth needs several
URLs (`/api/auth/signin`, `/api/auth/session`, `/api/auth/callback/...`). This one file
handles all of them. You import your shared `authOptions` so everything uses the same config.

### ✅ Test this Part
- [x] `npm run build` passes with no errors.
- [x] `npm run dev`, then open <http://localhost:3000/api/auth/providers> — you should see a
      small JSON blob mentioning `credentials`. That means the engine is wired up. 🎉

---

# Part B — Sign up 📝

Now people can create accounts.

### B1. Create the register API
**👉 Follow [`register-api.txt`](./register-api.txt)** to create
**`app/api/register/route.ts`**.
- [x] File created

### B2. Create the signup page
**👉 Follow [`signup-page.txt`](./signup-page.txt)** to create **`app/signup/page.tsx`**.
- [x] File created

### ✅ Test this Part
- [x] Visit <http://localhost:3000/signup>, fill the form, submit.
- [x] Open `npx prisma studio` → a **new User** appears, and its `password` is a long
      **hash** (like `$2a$10$…`), never the text you typed.
- [x] Try signing up again with the **same email** → you should see
      "An account with this email already exists".

---

# Part C — Log in 🔑

Now accounts can actually log in, and the app remembers them.

### C1. Create the session provider
**👉 Follow [`session-provider.txt`](./session-provider.txt)** to create
**`app/providers.tsx`**.
- [x] File created

### C2. Wrap the app in the provider
**File to edit:** `app/layout.tsx`. Import the provider and wrap `{children}` with it:
```tsx
import Providers from "./providers";
// ...
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
```
- [x] `layout.tsx` wraps children in `<Providers>`

**Why:** this makes the "who's logged in?" information available to every component in the
app (see `session-provider.txt` for the full reason).

### C3. Create the login page
**👉 Follow [`login-page.txt`](./login-page.txt)** to create **`app/login/page.tsx`**.
- [x] File created

### ✅ Test this Part
- [x] Visit <http://localhost:3000/login>. Log in with the **seeded admin**:
      `admin@bookease.com` / `Password123!` (from your Phase 1 seed).
- [x] A **wrong** password shows "Invalid email or password".
- [x] A correct login sends you to the home page with no error.

---

# Part D — Protect pages & enforce roles 🛡️

Finally, lock things down.

### D1. Add the middleware
**👉 Follow [`middleware.txt`](./middleware.txt)** to create **`middleware.ts`** at the
**project root** (next to `package.json`).
- [x] `middleware.ts` created

### D2. Make the dashboard admin-only
**File to edit:** `app/dashboard/page.tsx`. Turn it into a server component that checks the
session. Replace the top of the file so it looks like this (keep your existing dashboard
JSX inside the `return`):
```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");            // not logged in → login
  if (session.user?.role !== "ADMIN") redirect("/"); // logged in but not admin → home

  return (
    <div className="p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Signed in as {session.user?.name}</span>
          <SignOutButton />
        </div>
      </div>

      {/* ...keep your existing dashboard boxes here... */}
    </div>
  );
}
```
- [x] Dashboard checks the session and redirects non-admins

**Why on the page (not middleware):** middleware already ensured "logged in." The finer rule
"must be an ADMIN" is clearest right here, using `getServerSession` to read the role on the
server. (`getServerSession` uses the same `authOptions` — that's why we exported it.)

### D3. Create the sign-out button
Create **`components/sign-out-button.tsx`**:
```tsx
"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded bg-slate-800 px-4 py-2 text-white"
    >
      Sign out
    </button>
  );
}
```
- [x] File created

**Why `"use client"`:** the button responds to a click (`onClick`) and calls `signOut`, both
of which run in the browser — so it must be a client component.

### ✅ Test this Part (the big end-to-end test)
- [x] **Logged out**, visit `/dashboard` → you're redirected to `/login`.
- [x] Log in as a **CUSTOMER** (make one at `/signup`) → visiting `/dashboard` sends you to
      the home page (customers aren't admins).
- [x] Log in as the **ADMIN** (`admin@bookease.com` / `Password123!`) → `/dashboard` opens
      and shows "Signed in as Ada Admin" with a **Sign out** button.
- [x] Click **Sign out** → you're logged out and back on the home page.

---

## ✅ Definition of done (what the reviewer will check)
- [x] Sign up creates a user with a **hashed** password
- [x] Login works; wrong passwords are rejected
- [x] `/book` and `/dashboard` redirect logged-out users to `/login`
- [x] `/dashboard` is **admin-only** (customers get redirected)
- [x] Sign out works
- [x] `npm run build` passes
- [x] Notes section filled in

When all Parts pass, **stop and ask for a review.** Don't start Phase 3.

---

## Common mistakes to avoid
- **Forgetting `NEXTAUTH_SECRET`.** Without it, login silently fails. Set it in Part A1.
- **Missing `"use client"`** on `signup`, `login`, `providers`, or `sign-out-button` — you'll
  get errors about hooks/events. Those four are client components.
- **Wrong folder name for the NextAuth route.** It must be exactly
  `app/api/auth/[...nextauth]/route.ts`, brackets and all.
- **Editing a Part before the previous one's test passes.** Go in order A → B → C → D.
- **Committing `.env`.** Check `git status` — it must not appear.

---

## Notes (fill this in as you go)
> What clicked, what didn't, any errors + fixes. (Especially anything from `auth-concepts.md`
> that finally made sense once you saw it working.)

-
-
-

---

## Resources
- Next.js — Authentication guide: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- NextAuth (v4): <https://next-auth.js.org/getting-started/introduction>
- NextAuth — Credentials provider: <https://next-auth.js.org/providers/credentials>
- NextAuth — `getServerSession`: <https://next-auth.js.org/configuration/nextjs#getserversession>
- Next.js — Middleware: <https://nextjs.org/docs/app/building-your-application/routing/middleware> -->


<!-- # Phase 3 — Customer Booking Flow

**Status:** 🟡 In progress
**Goal:** a logged-in customer can book an appointment at `/book`; it's validated, saved
under their account, and confirmed.

> 👋 **Beginner note:** 3 Parts (A–C). Do one, run its "✅ Test this Part", then continue.
> Read [`booking-concepts.md`](./booking-concepts.md) first — it explains the two new tools.

---

## What you'll learn
- Handling forms cleanly with **react-hook-form**
- Describing validation rules with **zod** and sharing them between form and API
- Why we validate on **both** the client and the server
- Securing an API by taking the user from the **session**, not the request body

---

# Part A — Shared validation rules 📏

### A1. Create the booking schema
**👉 Follow [`appointment-schema.txt`](./appointment-schema.txt)** to create
**`lib/validations/appointment.ts`** (make the `lib/validations/` folder first).
- [x] File created with `bookingSchema` and the `BookingInput` type

### ✅ Test this Part
- [x] `npm run build` passes. (Nothing visible yet — this is a building block for B and C.)

**Why first:** both the API (Part B) and the form (Part C) import this. Building the shared
rule before the things that use it keeps them consistent.

---

# Part B — Make the API secure 🔒

### B1. Rewrite the appointments API
**👉 Follow [`appointments-api.txt`](./appointments-api.txt)** to **replace the contents** of
**`app/api/appointments/route.ts`**.
- [x] The route now uses `getServerSession` for the user id
- [x] It validates the body with `bookingSchema` (`safeParse`)
- [x] It no longer reads `userId` from the request body

### ✅ Test this Part
- [x] `npm run build` passes.
- [x] (You'll fully test this in Part C, once the form can call it — the API now needs a
      login cookie, so it's hard to call by hand.)

**Why this matters:** this is the security heart of the phase. Before, the browser could
claim to be any user. Now identity comes from the trusted session. Re-read
[`booking-concepts.md`](./booking-concepts.md) §3 if the "why" isn't crystal clear — this
task's Notes question is about it.

---

# Part C — The booking form 🗓️

### C1. Rewrite the booking page
**👉 Follow [`book-form.txt`](./book-form.txt)** to **replace the contents** of
**`app/book/page.tsx`** with the real react-hook-form version.
- [x] File uses `useForm` + `zodResolver(bookingSchema)`
- [x] It POSTs to `/api/appointments` and shows a confirmation on success

### ✅ Test this Part (the full end-to-end test)
- [x] Log in (seeded admin `admin@bookease.com` / `Password123!`, or a customer you made).
- [x] Go to `/book`. Submit with **no date** → "Please choose a date and time" appears
      instantly (client validation).
- [x] Pick a date in the **past** → "The appointment must be in the future".
- [x] Pick a **future** date → "Booking confirmed! ✅".
- [x] Open `npx prisma studio` → the new **Appointment** exists, and its `userId` is **your**
      user's id (proof it came from the session, not the form). 🎉
- [x] Bonus check: while **logged out**, visiting `/book` should still bounce you to `/login`
      (Phase 2 middleware).

---

## ✅ Definition of done (what the reviewer will check)
- [x] `lib/validations/appointment.ts` exists and is used by both the API and the form
- [x] The API takes `userId` from the session and rejects logged-out requests (401)
- [x] The form validates on the client and creates a real appointment
- [x] A confirmation shows after booking
- [x] `npm run build` passes
- [x] The Notes task below is done

When all Parts pass, **stop and ask for a review.** Don't start Phase 4.

---

## 📝 Notes task (required this phase — not optional!)
In the **Notes** section below, write short answers (1–2 sentences each). This *is* a task:

- [x] **Q1.** In your own words, why does the API take the user id from the session instead
      of from the form body? What could go wrong if it trusted the body?
- [x] **Q2.** We validate with the same zod schema in the form *and* the API. Why validate in
      both places instead of just one?
- [x] **Q3.** One thing that surprised you or that you had to debug in this phase.

> We've asked for Notes every phase — this time they're spelled out as questions so they're
> quick and concrete. They genuinely help us see your understanding (and help *you* remember
> it). Please don't skip. 🙏

---

## Common mistakes to avoid
- **Missing `"use client"`** at the top of `app/book/page.tsx` (it uses hooks).
- **Forgetting to create the `lib/validations/` folder** before the schema file.
- **Testing while logged out** — booking requires a session; log in first.
- **Editing Part C before Part A/B build cleanly** — go in order.

---

## Notes (write your answers here)
**Q1 (session vs form for user id):**
- The API uses the session because the browser cannot be trusted to say who the user is.  If the API accepted a userId from the form, someone could change it and create appointments for another user's account.
**Q2 (why validate in both places):**
- The form validation gives the user quick feedback before submitting. The API validation protects the database because requests can bypass the form and call the API directly.
**Q3 (something you debugged / learned):**
- I learned how React Hook Form connects with Zod through zodResolver and how the server can securely identify the logged-in user from the session.
---

## Resources
- react-hook-form — Get started: <https://react-hook-form.com/get-started>
- zod — docs: <https://zod.dev>
- zod + react-hook-form: <https://react-hook-form.com/get-started#SchemaValidation>
- NextAuth — `getServerSession`: <https://next-auth.js.org/configuration/nextjs#getserversession> -->




<!-- # Phase 4 — Complete the Appointments API

**Status:** 🟡 In progress
**Goal:** add GET (list, scoped by role) and PATCH (confirm/cancel/reschedule, with
permission checks) to the appointments API.

> 👋 **Beginner note:** 3 Parts (A–C). Backend only — you'll test with the browser and the
> DevTools console. Read [`authorization-concepts.md`](./authorization-concepts.md) first;
> keep its **permission table** open while you write Part C.

---

## What you'll learn
- Scoping database queries by the logged-in user (**data isolation**)
- Writing an **update** validation schema (everything optional, but at least one field)
- Enforcing **permission rules** (owner vs admin; who can confirm vs cancel)
- Using the right **status codes**: 401, 403, 404, 400

---

# Part A — Rules for updates 📏

### A1. Add the update schema
**👉 Follow [`update-schema.txt`](./update-schema.txt)** to **add** `updateAppointmentSchema`
to your existing **`lib/validations/appointment.ts`** (keep `bookingSchema`).
- [x] `updateAppointmentSchema` and `UpdateAppointmentInput` added

### ✅ Test this Part
- [x] `npm run build` passes.

---

# Part B — List appointments (GET) 📋

### B1. Add the GET handler
**👉 Follow [`list-appointments.txt`](./list-appointments.txt)** to add a `GET` function to
**`app/api/appointments/route.ts`** (alongside the existing `POST`).
- [x] GET returns only the user's own appointments for a customer, all for an admin

### ✅ Test this Part
- [x] `npm run build` passes.
- [x] Log in as the **admin** (`admin@bookease.com` / `Password123!`), visit
      <http://localhost:3000/api/appointments> → you see **all** appointments as JSON.
- [x] Log in as a **customer** (make one at `/signup`, book something at `/book`), visit the
      same URL → you see **only your own**. That difference is data isolation working. 🎉

---

# Part C — Confirm / cancel / reschedule (PATCH) 🔧

### C1. Create the dynamic route
**👉 Follow [`update-appointment.txt`](./update-appointment.txt)** to create
**`app/api/appointments/[id]/route.ts`** (the folder name includes the square brackets).
- [x] File created with a `PATCH` handler
- [x] It checks: logged in (401) → exists (404) → allowed (403) → valid (400) → action
      allowed (403) → update

### ✅ Test this Part (use the DevTools console — see `update-appointment.txt`)
Get an appointment id from Prisma Studio or the GET list, then in the browser console:
- [x] As **admin**, PATCH `{ "status": "CONFIRMED" }` → success; Studio shows CONFIRMED.
- [x] As a **customer** on your **own** appointment, PATCH `{ "status": "CANCELLED" }` → success.
- [x] As a **customer** trying `{ "status": "CONFIRMED" }` → **403** "Only an admin can confirm".
- [x] As a customer on **someone else's** appointment → **403**.
- [x] A made-up id → **404**.

---

## ✅ Definition of done (what the reviewer will check)
- [x] `updateAppointmentSchema` exists and is used by the PATCH route
- [x] GET scopes results by role (customer = own, admin = all)
- [x] PATCH enforces ownership and the confirm-is-admin-only rule
- [x] Correct status codes: 401 / 403 / 404 / 400 used appropriately
- [x] `npm run build` passes
- [x] The Notes task below is done

When all Parts pass, **stop and ask for a review.** Don't start Phase 5.

---

## 📝 Notes task (required)
Answer briefly in the Notes section (1–2 sentences each). This is a task with checkboxes:

- [x] **Q1.** How does your GET endpoint make sure a customer can't see other people's
      appointments? (Point to the specific line/idea.)
- [x] **Q2.** What's the difference between returning **401**, **403**, and **404**? Give an
      example of when each happens in your PATCH route.
- [x] **Q3.** A customer and an admin can both "change" an appointment — what can the admin
      do that the customer can't, and where in your code is that enforced?

---

## Common mistakes to avoid
- **Filtering after fetching instead of in the query.** Put the user filter in the Prisma
  `where` — don't fetch everything then filter in code (that can leak data and is slow).
- **Forgetting to `await params`.** In this Next.js, `params` is a Promise (Part C).
- **Wrong folder name** — it must be `app/api/appointments/[id]/route.ts`, brackets included.
- **Confusing 401 and 403** — 401 = not logged in; 403 = logged in but not allowed.

---

## Notes (write your answers here)
**Q1 (how customers are limited to their own data):**
- The GET query uses where: isAdmin ? {} : { userId: session.user.id }, so customers only see their own appointments.
**Q2 (401 vs 403 vs 404, with examples):**
- 401: User is not logged in.
- 403: User is logged in but isn't allowed to perform the action (for example, confirming an appointment as a customer).
- 404: The appointment ID doesn't exist.
**Q3 (what admin can do that customer can't, and where it's enforced):**
- An admin can confirm appointments, while customers cannot. This is enforced by checking !isAdmin && parsed.data.status === "CONFIRMED" in the PATCH route.
---

## Resources
- Next.js — Route Handlers: <https://nextjs.org/docs/app/building-your-application/routing/route-handlers>
- Next.js — Dynamic routes & `params`: <https://nextjs.org/docs/app/api-reference/file-conventions/route>
- Prisma — filtering (`where`): <https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting>
- Prisma — update: <https://www.prisma.io/docs/orm/prisma-client/queries/crud#update>
- MDN — HTTP status codes: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status> -->



<!-- # Phase 5 — Customer Dashboard

**Status:** 🟡 In progress
**Goal:** a logged-in customer can see their own appointments at `/appointments`, with
status badges, and cancel one.

> 👋 **Beginner note:** 3 Parts (A–C). Read [`dashboard-concepts.md`](./dashboard-concepts.md)
> first — the "server component vs client component" idea is the heart of this phase.

---

## What you'll learn
- Fetching data in a **server component** (query the DB directly)
- Building interactivity in a **client component** (the Cancel button)
- Refreshing server-rendered content with `router.refresh()`
- Reusing a shared UI component (the `table`) and small presentational pieces (badges)

---

# Part A — The list 📋

### A1. Create the status badge
**👉 Follow [`status-badge.txt`](./status-badge.txt)** to create
**`components/ui/status-badge.tsx`**.
- [x] `StatusBadge` component created

### A2. Create the dashboard page
**👉 Follow [`appointments-page.txt`](./appointments-page.txt)** to create
**`app/appointments/page.tsx`** (a server component that lists the user's appointments in a
table). *(The Cancel button import will error until Part B — that's expected.)*
- [x] `app/appointments/page.tsx` created

### A3. Protect the new route
**File to edit:** `proxy.ts`. Add `/appointments` to the `matcher` so logged-out users are
redirected to `/login`:
```ts
export const config = {
  matcher: ["/book/:path*", "/dashboard/:path*", "/appointments/:path*"],
};
```
- [x] `/appointments` added to the matcher

### ✅ Test this Part
- [x] `npm run build` passes (once Part B's Cancel button exists — do A then B, then test).
- [x] Logged in as a customer with bookings, `/appointments` shows a table with status badges.
- [x] Logged **out**, visiting `/appointments` redirects to `/login`.

---

# Part B — The Cancel button 🗑️

### B1. Create the Cancel button
**👉 Follow [`cancel-button.txt`](./cancel-button.txt)** to create
**`components/ui/cancel-button.tsx`** (a client component that PATCHes the appointment to
CANCELLED and refreshes).
- [x] `CancelButton` created and imported by the page (the Part A import now resolves)

### ✅ Test this Part
- [x] `npm run build` passes.
- [x] On `/appointments`, click **Cancel** on a PENDING/CONFIRMED appointment → confirm the
      prompt → the row's status changes to **CANCELLED** without a full page reload.
- [x] Check Prisma Studio → that appointment's status really is `CANCELLED`.
- [x] The **Cancel** button no longer appears on cancelled appointments.

---

# Part C — Make it reachable 🚪

### C1. Land on the dashboard after login
**File to edit:** `app/login/page.tsx`. Change the redirect so users go to their dashboard
after logging in:
```tsx
// was: router.push("/");
router.push("/appointments");
router.refresh();
```
- [x] Login now sends users to `/appointments`

### ✅ Test this Part
- [x] Log out, then log back in → you land on `/appointments`.
- [x] From there, "Book new" takes you to `/book`; booking then appears in the list.

---

## ✅ Definition of done (what the reviewer will check)
- [x] `/appointments` lists the logged-in customer's own appointments in a table
- [x] Status badges are colored by status
- [x] Cancel works and updates the list via `router.refresh()`
- [x] `/appointments` is protected (logged-out → `/login`)
- [x] Empty state shows when there are no appointments
- [x] `npm run build` passes
- [x] The Notes task below is done

When all Parts pass, **stop and ask for a review.** Don't start Phase 6.

---

## 📝 Notes task (required)
Answer briefly in the Notes section (1–2 sentences each):

- [x] **Q1.** Why is the appointments page a **server** component, but the Cancel button a
      **client** component?
- [x] **Q2.** What does `router.refresh()` do, and why do we call it after cancelling?
- [x] **Q3.** The page queries the database directly instead of calling your own
      `GET /api/appointments`. Why is that fine (even better) here?

---

## Common mistakes to avoid
- **Putting `"use client"` on the page.** The page is a *server* component — only the Cancel
  button is a client component.
- **Forgetting to add `/appointments` to the proxy matcher** — the page won't be protected.
- **`key` missing on table rows** — React needs `key={appt.id}` on each mapped `<TableRow>`.
- **Expecting the list to update without `router.refresh()`** — the server component won't
  re-run on its own.

---

## Notes (write your answers here)
**Q1 (server page vs client button):**
- The page is a server component because it fetches the session and database data. The Cancel button is a client component because it handles clicks and sends the PATCH request.
**Q2 (what router.refresh does):**
- Router.refresh reloads the server component with fresh data, so the updated appointment status appears without a full page refresh.
**Q3 (why query the DB directly here):**
- Because the page already runs on the server, it can access Prisma directly. Querying the database avoids an unnecessary request to the application's own API, making it more efficient.

---

## Resources
- Next.js — Server & Client Components: <https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns>
- Next.js — `useRouter().refresh()`: <https://nextjs.org/docs/app/api-reference/functions/use-router>
- Prisma — findMany / filtering: <https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting>
- shadcn/ui — Table: <https://ui.shadcn.com/docs/components/table> -->


# Phase 6 — Admin Dashboard

**Status:** 🟡 In progress
**Goal:** the admin's `/dashboard` shows real stats and a table of all appointments, with
Confirm/Cancel actions.

> 👋 **Beginner note:** only 2 Parts — this phase mostly reuses what you've built. Read
> [`admin-concepts.md`](./admin-concepts.md) first; it's largely "spot the pattern you
> already know."

---

## What you'll learn
- Loading related data with Prisma `include` (show the customer's name)
- Computing simple **stats** on the server
- Reusing components across pages (the admin actions mirror the customer's Cancel button)
- **Defense in depth** — security checked on both the page and the API

---

# Part A — Admin actions ⚙️

### A1. Create the Confirm/Cancel component
**👉 Follow [`admin-actions.txt`](./admin-actions.txt)** to create
**`components/ui/admin-actions.tsx`** (a client component with Confirm + Cancel buttons that
PATCH the appointment and refresh).
- [x] `AdminActions` component created

### ✅ Test this Part
- [x] `npm run build` passes once Part B uses it (do A then B, then test).

---

# Part B — The dashboard 📊

### B1. Rewrite the dashboard page
**👉 Follow [`dashboard-page.txt`](./dashboard-page.txt)** to **rewrite**
**`app/dashboard/page.tsx`** — keep the admin guard and header, replace the placeholder
boxes with real stat cards and a management table.
- [x] Stat cards show real numbers (total, pending, confirmed, customers)
- [x] The table lists all appointments with the customer's name
- [x] Each row has working Confirm/Cancel actions

### ✅ Test this Part (end-to-end)
- [x] Log in as the **admin** (`admin@bookease.com` / `Password123!`) and open `/dashboard`.
- [x] You see stat cards with real counts and a table of **all** appointments (from all
      customers), each showing the customer's name.
- [x] Click **Confirm** on a PENDING appointment → its badge changes to CONFIRMED and the
      "Confirmed" stat goes up (no full reload).
- [x] Click **Cancel** → badge changes to CANCELLED.
- [x] Check Prisma Studio → the changes saved.
- [x] Log in as a **customer** and visit `/dashboard` → you're redirected away (still
      admin-only).

---

## ✅ Definition of done (what the reviewer will check)
- [x] `/dashboard` shows real stats and all appointments (with customer names via `include`)
- [x] Confirm and Cancel work and update the page via `router.refresh()`
- [x] `/dashboard` is still admin-only (customers redirected)
- [x] `npm run build` passes
- [x] The Notes task below is done

When both Parts pass, **stop and ask for a review.** Only Phase 7 remains after this.

---

## 📝 Notes task (required — please don't skip 🙏)
Answer briefly in the Notes section (1–2 sentences each):

- [x] **Q1.** What does Prisma `include` do in your dashboard query, and why do you use
      `select` inside it?
- [x] **Q2.** The admin can confirm appointments. Name the **two** places that enforce
      "only admins can confirm," and why having both matters.
- [x] **Q3.** How is this admin dashboard similar to, and different from, the customer's
      `/appointments` page?

---

## Common mistakes to avoid
- **Putting `"use client"` on the dashboard page.** It's a *server* component; only
  `AdminActions` is a client component.
- **Forgetting `include`** — without it, `appt.user` is undefined and the customer name
  errors.
- **`select`ing the password** — only pull `firstName`, `lastName`, `email`. Never load the
  password into the page.
- **Missing `key={appt.id}`** on the mapped table rows.

---

## Notes (write your answers here)
**Q1 (what include/select do):**
- Include loads related data, such as the appointment's customer. Select limits the fields returned to only what is needed and avoids sensitive data.
**Q2 (two places admin-confirm is enforced, and why both):**
- It is enforced on the /dashboard page and the PATCH API endpoint. Both are needed so the UI is protected and the server still blocks unauthorized actions.
**Q3 (similar to / different from the customer dashboard):**
- Both display appointments using server-side data and shared components. The admin dashboard shows all customers' appointments, stats, and Confirm/Cancel actions, while customers only see their own appointments.

---

## Resources
- Prisma — relation queries (`include` / `select`): <https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries>
- Prisma — count: <https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing>
- Next.js — server & client components: <https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns>
