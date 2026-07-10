# Troubleshooting — Phase 3 (booking) blockers

Each entry: **what you'll see → why → fix.** Work one Part at a time. Still stuck? Send the
reviewer the exact step + the full error (terminal **and** browser console).

---

## 1. "Cannot find module '@/lib/validations/appointment'"

**Why:** the schema file (Part A) doesn't exist yet, or the folder/name is off.

**Fix:** create `lib/validations/appointment.ts` exactly (see `appointment-schema.txt`).
The `@/` prefix means "from the project root", so the path must be
`lib/validations/appointment.ts`.

---

## 2. Booking always returns 401 "You must be logged in"

**Why:** you're not logged in, or the session cookie isn't being sent.

**Fix:** log in first (Phase 2). Test `/book` in the same browser where you logged in. If
you *are* logged in and still get 401, confirm `getServerSession(authOptions)` is imported
correctly in the API and that Phase 2's `lib/auth.ts` and `types/next-auth.d.ts` exist.

---

## 3. The form submits but nothing happens / no confirmation

**Why:** a fetch error, or the response wasn't OK and the error isn't shown.

**Fix:** open browser dev tools → **Console** and **Network** tabs. Click the
`appointments` request to see the status and response. A 400 means validation failed (read
the message); a 500 means a server error (check the dev-server terminal).

---

## 4. Validation messages never appear

**Why:** the form isn't wired to zod, or inputs aren't registered.

**Fix:** confirm `useForm({ resolver: zodResolver(bookingSchema) })`, that each input uses
`{...register("date")}` / `{...register("notes")}`, and that you render
`errors.date?.message`. Also make sure the page starts with `"use client"`.

---

## 5. "The appointment must be in the future" even for a future date

**Why:** timezones — `datetime-local` gives local time, and edge cases near "now" can trip
the check.

**Fix:** pick a time clearly in the future (e.g. tomorrow). If it still misbehaves, log the
value: `console.log(new Date(value), new Date())` inside the form to compare.

---

## 6. TypeScript error on `session.user.id`

**Why:** the type augmentation from Phase 2 is missing.

**Fix:** confirm `types/next-auth.d.ts` exists (Phase 2) and includes `id` on `Session.user`.
Restart your editor's TypeScript server if it still shows red.

---

## 7. `zodResolver` type error / version mismatch

**Why:** wrong import path.

**Fix:** import it as `import { zodResolver } from "@hookform/resolvers/zod";`. The installed
versions (react-hook-form 7, zod 4, @hookform/resolvers 5) work together.

---

## Still stuck?
Send: which Part/step, the exact action, and the full error text from **both** the terminal
and the browser console.

## Reference shelf
- react-hook-form: <https://react-hook-form.com>
- zod: <https://zod.dev>
- Next.js route handlers: <https://nextjs.org/docs/app/building-your-application/routing/route-handlers>