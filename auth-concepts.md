<!-- # How authentication works — the ideas (read before coding)

Auth has a lot of new words. This page explains them in plain English so the code in
`foundation.md` makes sense. No typing here — just understanding. ~10 minutes.

---

## 1. Authentication vs Authorization

Two different questions that sound similar:

- **Authentication** = *"Who are you?"* → proving identity by logging in.
- **Authorization** = *"What are you allowed to do?"* → e.g. only admins see the dashboard.

Phase 2 does both: logging in (authentication) and role checks (authorization).

---

## 2. Why we hash passwords (never store the real one)

If we stored passwords as plain text and the database ever leaked, every account would be
exposed. So we **hash** them: run the password through a one-way function (bcrypt) that
turns `"Password123!"` into something like `"$2a$10$N9qo8uLO...."`.

- **One-way:** you can't turn the hash back into the password.
- **To check a login:** we hash the password the user just typed and compare it to the
  stored hash. If they match, the password was correct — without us ever storing the real one.

You already used this in the seed (`bcrypt.hash`). For login we'll use `bcrypt.compare`.

---

## 3. What a "session" is

HTTP is *stateless* — the server forgets you between requests. A **session** is how the app
remembers "this browser is logged in as Charlie" across pages.

We use a **JWT (JSON Web Token)** session:
1. When you log in successfully, the server creates a **token** — a small, **signed** string
   that says "this is user X with role CUSTOMER."
2. The token is stored in a **cookie** in your browser.
3. On every request, the browser sends the cookie back, so the server knows who you are.

"**Signed**" means the server stamps the token with a secret (`NEXTAUTH_SECRET`). If anyone
tampers with the token, the signature won't match and it's rejected. That's why you must
set that secret — it protects the whole system.

> **Why JWT instead of storing sessions in the database?** With the credentials (email +
> password) login, NextAuth uses JWT by default, and it means we don't need an extra
> "sessions" table or a database adapter. Simpler = better for learning.

---

## 4. The pieces we'll build, and how they fit

```
                ┌─────────────────────────────────────────────┐
   Sign up  ──► │ /api/register  → hash password → create User │  (Part B)
                └─────────────────────────────────────────────┘

                ┌─────────────────────────────────────────────┐
   Log in   ──► │ NextAuth "authorize()" in lib/auth.ts:       │  (Part A + C)
                │   find user by email → bcrypt.compare        │
                │   if OK → create a JWT with id + role        │
                └─────────────────────────────────────────────┘
                                     │
                                     ▼
                ┌─────────────────────────────────────────────┐
   Every page  │ Cookie holds the JWT. The app reads it to    │  (Part C + D)
   after login │ know who you are and your role.              │
                └─────────────────────────────────────────────┘
```

- **`lib/auth.ts`** — the config: *how* to log someone in (the `authorize` function) and
  *what* to put in their token (their `id` and `role`).
- **`app/api/auth/[...nextauth]/route.ts`** — the URL NextAuth lives at. You don't write
  much here; it just plugs your config into Next.js.
- **`app/api/register/route.ts`** — creating a new account (NextAuth logs people *in*, but
  doesn't sign them *up* — that's our job).
- **`app/signup/page.tsx` / `app/login/page.tsx`** — the forms people use.
- **`app/providers.tsx`** — wraps the app so any component can ask "who's logged in?"
- **`middleware.ts`** — a guard that runs *before* a page loads and redirects logged-out
  users away from protected pages.

---

## 5. Two places we check permissions (and why both)

1. **Middleware** — runs before protected pages (`/book`, `/dashboard`). It's a fast gate:
   *"Are you logged in at all? If not, go to /login."*
2. **Server-side role check** — on the dashboard we also ask *"Are you an ADMIN?"* using
   `getServerSession`. If a logged-in customer tries to open the admin dashboard, we send
   them away.

Why both? Middleware is great for the broad "must be logged in" rule across many pages.
The finer "must be an admin" rule is clearer to do right on the page that needs it. You'll
see both patterns — they're standard.

---

## 6. The login flow, end to end (what actually happens)

1. User types email + password on `/login` and submits.
2. Our page calls NextAuth's `signIn("credentials", { email, password })`.
3. NextAuth runs `authorize()` in `lib/auth.ts`: it looks up the user by email and runs
   `bcrypt.compare`. If the password is wrong (or no such user), it returns `null` → login
   fails.
4. If it returns the user, NextAuth builds a JWT containing the user's `id` and `role`
   (we add those in the `jwt` and `session` callbacks).
5. The token goes into a cookie. Now the user is "logged in" and we redirect them.

---

## You're ready

If you can explain, in your own words: (a) why we hash passwords, (b) what a session/JWT
is, and (c) the difference between the middleware check and the admin check — you're ready.
Open [`foundation.md`](./foundation.md) and start **Part A**.

## Read more
- Next.js — Authentication guide: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- NextAuth (v4) docs: <https://next-auth.js.org/getting-started/introduction>
- NextAuth — Credentials provider: <https://next-auth.js.org/providers/credentials> -->

# The ideas behind authorization (read before coding)

This page explains the *why* behind Phase 4's permission rules. ~8 minutes, no typing.

---

## 1. Authentication vs Authorization (again, because it matters)

- **Authentication** = *"Who are you?"* → the login/session (Phase 2).
- **Authorization** = *"What are you allowed to do?"* → this phase.

A logged-in user is authenticated. But being logged in doesn't mean you can do *anything* —
a customer shouldn't be able to see other people's appointments or confirm their own. That
extra layer of "what are you allowed to do" is authorization.

---

## 2. Data isolation: the GET endpoint

When a customer asks for "appointments", they must get **only their own**. An admin gets
**all** of them. Same URL, different results depending on who's asking.

We do this with the database query itself:

```
if admin  → find ALL appointments
else      → find appointments WHERE userId = (the logged-in user's id)
```

The customer never even *receives* other people's data. This is called **data isolation**,
and doing it in the query (not by filtering afterwards) is the safe way.

---

## 3. The permission rules for changing an appointment (PATCH)

Here's exactly who can do what. Keep this table in mind as you write Part C:

| Action | Customer, own appointment | Customer, someone else's | Admin |
|---|---|---|---|
| **Cancel** (status → CANCELLED) | ✅ allowed | ❌ 403 Forbidden | ✅ allowed |
| **Confirm** (status → CONFIRMED) | ❌ 403 (admins only) | ❌ 403 | ✅ allowed |
| **Reschedule** (change the date) | ✅ allowed | ❌ 403 | ✅ allowed |

Two checks make this work:
1. **Ownership:** you can only touch your own appointment — unless you're an admin.
2. **Action limit:** even on your own appointment, a customer can't *confirm* — only an
   admin can. (Confirming is a business decision the provider makes.)

---

## 4. The three "no" status codes: 401 vs 403 vs 404

These trip up a lot of beginners. They mean different things:

| Code | Name | Meaning | Example here |
|---|---|---|---|
| **401** | Unauthorized | *You're not logged in.* | No session at all |
| **403** | Forbidden | *You're logged in, but not allowed to do this.* | Customer tries to confirm |
| **404** | Not Found | *The thing doesn't exist.* | No appointment with that id |

Getting these right makes your API honest and easy to debug. "401 vs 403" specifically:
401 = "I don't know who you are", 403 = "I know who you are, and the answer is no".

---

## 5. The order you check things (in PATCH)

Order matters — check cheap/foundational things first:

1. **Logged in?** No → **401**.
2. **Does the appointment exist?** No → **404**.
3. **Are you allowed to touch it** (owner or admin)? No → **403**.
4. **Is the requested change valid** (good status/date)? No → **400**.
5. **Is this specific action allowed** (customer can't confirm)? No → **403**.
6. All good → make the change, return **200**.

---

## You're ready
If you can explain: (a) how the GET query differs for a customer vs an admin, (b) the
difference between 401, 403, and 404, and (c) why a customer can cancel but not confirm —
open [`foundation.md`](./foundation.md) and start **Part A**.

## Read more
- MDN — HTTP status codes: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>
- Next.js — Route Handlers: <https://nextjs.org/docs/app/building-your-application/routing/route-handlers>
- Next.js — Dynamic route segments (`params`): <https://nextjs.org/docs/app/api-reference/file-conventions/route>