
<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->




# Phase 3 — Customer Booking Flow (how this phase works)

> 🚦 **New here? Open [`STUDENT-START-HERE.md`](./STUDENT-START-HERE.md) first**, then read
> [`booking-concepts.md`](./booking-concepts.md). This `readme.md` explains *how* the phase
> and its files work.

**Goal:** turn the static `/book` form into a real one that validates input and saves an
appointment for the logged-in user, via a secured API.

---

## The big idea of this phase

Three pieces work together:

```
   The FORM  ──POST /api/appointments──►  The API  ──►  The DATABASE
 (validates as                        (checks login,
  you type,                            re-validates,
  zod + RHF)                           saves under the
                                       session user)
```

The most important lesson: **who the user is comes from their login session on the
server — never from the form.** If we trusted a `userId` sent by the browser, anyone could
book appointments as anyone else. You'll fix exactly that.

---

## Read in this order
1. [`STUDENT-START-HERE.md`](./STUDENT-START-HERE.md) — summary + path
2. This file (`readme.md`) — how it works
3. [`booking-concepts.md`](./booking-concepts.md) — the ideas (no typing)
4. [`foundation.md`](./foundation.md) — the tasks (Parts A–C)
5. [`troubleshooting.md`](./troubleshooting.md) — when stuck

---

## Guide-file style (same as before)
`.txt` files are **explained code**. Read them, then **type the real code yourself** into
the file they name. Don't keep the long teaching comments in your real files.

| Guide file | Real file it maps to | Part |
|---|---|---|
| [`appointment-schema.txt`](./appointment-schema.txt) | `lib/validations/appointment.ts` (create) | A |
| [`appointments-api.txt`](./appointments-api.txt) | `app/api/appointments/route.ts` (rewrite) | B |
| [`book-form.txt`](./book-form.txt) | `app/book/page.tsx` (rewrite) | C |

---

## Files you'll create or edit

| File | Create/edit | Part |
|---|---|---|
| `lib/validations/appointment.ts` | create | A |
| `app/api/appointments/route.ts` | rewrite (it already exists) | B |
| `app/book/page.tsx` | rewrite (replace the static form) | C |

> ⚠️ No deletions this phase. In Part B you **replace** the contents of the existing API
> file — that's an edit, not a delete.

---

## When you're done
Finish `foundation.md`, complete the Notes task, then tell the reviewer. **Don't start
Phase 4** until we've reviewed Phase 3.
