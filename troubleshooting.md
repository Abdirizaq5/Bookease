<!-- # Troubleshooting — Phase 3 (booking) blockers

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
- Next.js route handlers: <https://nextjs.org/docs/app/building-your-application/routing/route-handlers> -->

# Troubleshooting — Phase 5 (dashboard) blockers

Each entry: **what you'll see → why → fix.** Still stuck? Send the reviewer the exact step +
the full error (terminal **and** browser console).

---

## 1. Error: "You're importing a component that needs `useState`/`onClick`… mark it 'use client'"

**Why:** you put interactive code in a server component, or forgot `"use client"` on the
Cancel button.

**Fix:** the **page** stays a server component (no `"use client"`). The **Cancel button**
(`components/ui/cancel-button.tsx`) must start with `"use client"`.

---

## 2. "Cannot find module '@/components/ui/cancel-button'" (or status-badge)

**Why:** the component file doesn't exist yet, or the path/name differs.

**Fix:** create both files exactly: `components/ui/status-badge.tsx` and
`components/ui/cancel-button.tsx`. Do Part A and Part B before the final build.

---

## 3. `/appointments` shows nothing / an empty table

**Why:** that customer has no appointments (correct!), or you're logged in as a different
user than the one who booked.

**Fix:** book something at `/book` while logged in as that user, then reload. Remember: the
page only shows the **logged-in user's** appointments.

---

## 4. Logged-out users can still open `/appointments`

**Why:** the route isn't in the proxy matcher.

**Fix:** add `"/appointments/:path*"` to the `matcher` array in `proxy.ts`, then restart the
dev server.

---

## 5. Clicking Cancel does nothing / the list doesn't update

**Why:** the fetch failed, or `router.refresh()` wasn't called.

**Fix:** open DevTools → Network, click the `PATCH` request, check its status. A 403 means a
permission issue (are you the owner?); a 404 means a bad id. Make sure `handleCancel` calls
`router.refresh()` after a successful response.

---

## 6. Dates look strange or show a long raw string

**Why:** `appointmentDate` is a Date object; how it prints depends on formatting.

**Fix:** `appt.appointmentDate.toLocaleString()` gives a readable date/time. (It shows the
**server's** timezone — fine for now; nicer formatting can come later.)

---

## 7. React warning: "Each child in a list should have a unique key"

**Why:** the mapped `<TableRow>` is missing a `key`.

**Fix:** add `key={appt.id}` to each `<TableRow>` in the `.map(...)`.

---

## Still stuck?
Send: which Part/step, what you clicked, and the full error from the terminal + browser
console.

## Reference shelf
- Next.js server/client components: <https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns>
- Next.js useRouter: <https://nextjs.org/docs/app/api-reference/functions/use-router>
- shadcn table: <https://ui.shadcn.com/docs/components/table>