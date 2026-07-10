# The ideas behind the booking flow (read before coding)

This page explains the *why* behind Phase 3's code. ~8 minutes, no typing.

---

## 1. Two new tools: react-hook-form and zod

**The problem:** forms are fiddly. You have to track what's typed, show error messages,
disable the button while submitting, and stop invalid data. Doing all that by hand (lots of
`useState`) gets messy fast.

**react-hook-form (RHF)** manages all of that for you. You "register" each input, and RHF
tracks its value, validates it, and gives you a clean `handleSubmit`.

**zod** describes the *rules* your data must follow, as a schema:
```ts
z.object({ date: z.string().min(1), notes: z.string().max(500).optional() })
```
Zod can then check any data against those rules and produce clear error messages.

**zodResolver** is the small connector that lets RHF use a zod schema for validation. Write
the rules once in zod, and the form enforces them automatically.

---

## 2. Why validate in TWO places (client AND server)

You'll use the *same* zod schema in the form **and** in the API. That's on purpose:

- **Client-side (in the form):** gives the user **instant feedback** — "please choose a
  date" appears the moment they submit, without a round-trip to the server. Nice UX.
- **Server-side (in the API):** is the **real security**. A clever user can bypass your form
  entirely (e.g. with browser dev tools) and POST anything to your API. So the server must
  **never trust** what it receives — it re-checks everything.

Rule of thumb: **client validation is for UX; server validation is for safety.** You need
both. Writing the rules once in a shared zod schema means they can't drift apart.

---

## 3. The most important lesson: get the user from the SESSION, not the form

Right now the appointments API expects the browser to send a `userId`. That's a security
hole: the browser could send *any* user's id and book on their behalf.

The fix: the API asks **"who is logged in?"** using `getServerSession` (from Phase 2) and
uses *that* id. The browser only sends the appointment details (date, notes) — never *who*
they are. Identity always comes from the trusted session on the server.

```
❌ Before:  browser says "create appointment for userId X"   ← can be faked
✅ After:   server says "the logged-in user is Y, book for Y" ← trusted
```

This is a core security principle you'll use forever: **never let the client tell you who
they are.**

---

## 4. The booking flow, end to end

1. A logged-in user opens `/book` (middleware already guarantees they're logged in).
2. They pick a date/time and optional notes. RHF + zod validate as they submit.
3. If valid, the form `POST`s the details to `/api/appointments`.
4. The API: checks there's a session → re-validates with the same zod schema → creates the
   appointment with `userId` from the session.
5. The form shows a **confirmation** message.

---

## 5. What we're deliberately keeping simple (MVP)

- The form collects only **date/time** and **notes**. Your name/email aren't needed — the
  server already knows who you are from the session.
- No "service" selector or available-slot checking yet — those are future enhancements.
- Seeing a list of *your* appointments comes in **Phase 5** (customer dashboard). Phase 3 is
  just about **creating** one.

---

## You're ready
If you can explain: (a) what zodResolver connects, (b) why we validate on both client and
server, and (c) why the API takes the user from the session — open
[`foundation.md`](./foundation.md) and start **Part A**.

## Read more
- react-hook-form: <https://react-hook-form.com/get-started>
- zod: <https://zod.dev>
- Using zod with react-hook-form: <https://react-hook-form.com/get-started#SchemaValidation>