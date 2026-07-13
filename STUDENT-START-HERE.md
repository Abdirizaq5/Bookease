<!-- # 👋 START HERE — Phase 3: Customer Booking Flow

The moment it all comes together! Phases 0–2 built the database, the schema, and login.
Now a **logged-in customer can actually book an appointment** — and it gets saved to the
database under *their* account.

By the end, `/book` is a real, validated form that creates a real appointment and shows a
confirmation.

---

## 🎯 What you'll achieve in Phase 3

- ✅ A working **booking form** at `/book` that validates input as you type
- ✅ Appointments saved to the database **under the logged-in user** (from their session)
- ✅ A **secure API** that no longer trusts the browser to say who the user is
- ✅ **Validation in two places** — instant feedback in the form, and a safety net on the server
- ✅ A friendly **confirmation** screen after booking

> 🧠 This phase introduces two popular libraries — **react-hook-form** (form handling) and
> **zod** (validation). You'll read a short concepts page first so they don't feel like magic.

---

## 🗺️ The path to follow (in order)

```
1. Read  STUDENT-START-HERE.md   ← you are here
2. Read  readme.md               ← how this phase + its guide files work
3. Read  booking-concepts.md     ← the ideas (react-hook-form, zod, client vs server)
4. Open  foundation.md           ← THE task list, in 3 parts:
         Part A — shared validation rules (one zod schema)
         Part B — make the API secure (use the session, not the form)
         Part C — the booking form (react-hook-form + confirmation)
5. Stuck?  → troubleshooting.md
6. Done?   → tell the reviewer. STOP — don't start Phase 4.
```

Work **one Part at a time** and run its "✅ Test this Part" step before moving on.

---

## 📁 What each file is for

| File | What it's for | When |
|---|---|---|
| `STUDENT-START-HERE.md` | This overview | First |
| `readme.md` | How the phase + guide files work | Second |
| `booking-concepts.md` | The ideas behind the code | Third |
| `foundation.md` | The task list (Parts A–C) | Your main document |
| `troubleshooting.md` | Fixes for common blockers | When stuck |
| `appointment-schema.txt` | Explained code → `lib/validations/appointment.ts` | Part A |
| `appointments-api.txt` | Explained code → `app/api/appointments/route.ts` | Part B |
| `book-form.txt` | Explained code → `app/book/page.tsx` | Part C |

---

## 🚧 Before you start
- Make sure Phase 2 is working: you can **log in**. Booking only works when logged in.
- (Tidy-up from Phase 2, if not done: delete the stray `auth-config` file, fill your Notes.)

---

## ✅ When you're finished
Tick every box in `foundation.md`, complete the **Notes** task, and tell the reviewer.
We'll review, then unlock **Phase 4 (Complete the Appointments API)**. Don't jump ahead. 🚀
 -->


# 👋 START HERE — Phase 4: Complete the Appointments API

So far you can *create* an appointment. But nobody can **see** their appointments yet, and
an admin can't **confirm** or **cancel** them. Phase 4 finishes the API so the data can be
read and changed — safely.

This phase is all about **authorization**: making sure each person can only see and do what
they're allowed to. You already met this idea in Phase 3 (getting the user from the
session); now you'll apply it in depth.

---

## 🎯 What you'll achieve in Phase 4

- ✅ A **GET** endpoint that lists appointments — customers see **only their own**, admins
  see **all**
- ✅ A **PATCH** endpoint to **confirm / cancel / reschedule** an appointment
- ✅ Proper **permission rules**: customers can cancel their own; only admins can confirm
- ✅ A solid understanding of **401 vs 403 vs 404** (the "who are you / not allowed / not
  found" status codes)

> There's no new UI in this phase — it's pure backend. Phases 5 and 6 will build the
> dashboards that *use* these endpoints. Think of Phase 4 as building the engine before the
> dashboard.

---

## 🗺️ The path to follow (in order)

```
1. Read  STUDENT-START-HERE.md      ← you are here
2. Read  readme.md                  ← how this phase + its guide files work
3. Read  authorization-concepts.md  ← the ideas (permissions, 401/403/404)
4. Open  foundation.md              ← THE task list, in 3 parts:
         Part A — rules for updates (a second zod schema)
         Part B — GET: list appointments (scoped by role)
         Part C — PATCH: confirm / cancel / reschedule (with permission checks)
5. Stuck?  → troubleshooting.md
6. Done?   → tell the reviewer. STOP — don't start Phase 5.
```

Work one Part at a time and run its "✅ Test this Part" step before moving on.

---

## 📁 What each file is for

| File | What it's for | When |
|---|---|---|
| `STUDENT-START-HERE.md` | This overview | First |
| `readme.md` | How the phase + guide files work | Second |
| `authorization-concepts.md` | The ideas behind permissions | Third |
| `foundation.md` | The task list (Parts A–C) | Your main document |
| `troubleshooting.md` | Fixes for common blockers | When stuck |
| `update-schema.txt` | Explained code → extend `lib/validations/appointment.ts` | Part A |
| `list-appointments.txt` | Explained code → add GET to `app/api/appointments/route.ts` | Part B |
| `update-appointment.txt` | Explained code → `app/api/appointments/[id]/route.ts` | Part C |

---

## 🚧 Before you start
- Phase 3 should be working (you can book an appointment).
- (Tidy-up from Phase 3: delete the old commented-out code in
  `app/api/appointments/route.ts` if you haven't — clean files are easier to work in.)

---

## ✅ When you're finished
Tick every box in `foundation.md`, complete the **Notes** task, and tell the reviewer.
We'll review, then unlock **Phase 5 (Customer Dashboard)**. Don't jump ahead. 🚀