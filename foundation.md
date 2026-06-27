# Phase 0 — Foundation & Cleanup

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
- [ ] Run `npm install` in the project root.
- [ ] Confirm a `node_modules/` folder appeared and there are **no red errors** at the end.

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
- [ ] List what's available: `ls node_modules/next/dist/docs/`
- [ ] Open the guide most relevant to **pages/routing** and skim it.
- [ ] Note (in your own words, in the "Notes" section at the bottom) anything that
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

- [ ] Confirm the real app is the root one: `app/page.tsx` is the landing page you saw in the browser.
- [ ] Delete the entire `src/` directory:

```bash
rm -rf src
```

- [ ] Run `npm run dev` again — landing page still loads, no new errors.

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

- [ ] Read `book-page.txt` top to bottom.
- [ ] Type the page component into `app/book/page.tsx` (a heading + a static form).
- [ ] Make sure the file has `export default function BookPage() { ... }`.

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

- [ ] Get a Neon database and connection string — see [`neon-setup.md`](./neon-setup.md).
- [ ] Create a file named exactly `.env` in the project root (same folder as `package.json`).
- [ ] Put one line in it (replace the placeholder with your **real** Neon value):
```bash
# .env  (git-ignored — never commit real secrets)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```
- [ ] Get the real value from your Neon dashboard (Connection Details → connection string).
      If you don't have access, ask the reviewer.
- [ ] Run `git status` and confirm `.env` does **not** appear in the list.

**Why `.env`:** secrets (passwords, API keys) must **never** be committed to git. Look at
`.gitignore` — it already ignores `.env*`. The app reads this value at runtime via
`process.env.DATABASE_URL`, which is exactly what `prisma.config.ts` and
`prisma/schema.prisma` reference as `env("DATABASE_URL")`.

> ⚠️ Do **not** paste the real connection string into chat, a commit, or this doc.

---

### 6. Create the database tables (first migration)
Your Prisma **schema** (`prisma/schema.prisma`) describes the tables you *want*. A
**migration** is the step that actually creates them in the real database.

- [ ] Run the first migration:
```bash
npx prisma migrate dev --name init
```
- [ ] Generate the Prisma client (often runs automatically with the line above, but run
      it to be sure):
```bash
npx prisma generate
```
- [ ] Confirm a `prisma/migrations/` folder now exists with an `init` migration inside.

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

- [ ] **Page title:** in `app/layout.tsx`, the `metadata` object still says
      *"Create Next App"*. Change `title` and `description` to real BookEase text.
- [ ] **Stray file:** delete the duplicate `app/favicon1.ico` (keep `app/favicon.ico`):
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
- [ ] `npm run build` completes with **no errors**.
- [ ] `npm run dev` runs; these all load without crashing:
      `/` (landing), `/book`, `/dashboard`.
- [ ] `npx prisma studio` shows the `User` and `Appointment` tables.

When all boxes above are ticked, **stop and ask for a review.** Don't start Phase 1 yet.

---

## ✅ Definition of done (what the reviewer will check)

- [ ] `node_modules` installed; `npm run build` passes cleanly
- [ ] `src/` directory is gone; only root `app/` remains
- [ ] `app/book/page.tsx` renders a page (has a default export)
- [ ] `.env` exists locally with `DATABASE_URL` (and is **not** committed)
- [ ] `prisma/migrations/` exists; Prisma Studio shows both tables
- [ ] `app/layout.tsx` metadata updated; `favicon1.ico` removed
- [ ] All three routes load in the browser without errors

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
- Neon — connection strings: <https://neon.tech/docs/connect/connect-from-any-app>