# Understanding the schema — a guided tour

This explains **every part** of `prisma/schema.prisma` in plain English, and *why* it's
written that way. Read it with the real file open side by side. There's nothing to type
here — the goal is understanding. (You'll write a short summary in your Notes afterwards.)

---

## Big picture: what is a "schema"?

`prisma/schema.prisma` is the **single source of truth** for your database. It describes:
- **what tables exist** (Prisma calls them *models*),
- **what columns each table has** (*fields*),
- **how tables relate** to each other.

Prisma reads this file to do two things:
1. **Generate the migration SQL** that creates/updates the real database tables.
2. **Generate the Prisma Client** — the TypeScript code that lets you query the database
   with autocomplete and type safety (e.g. `prisma.user.findMany()`).

So the schema drives *both* your database structure *and* your code. That's why we spend a
phase understanding it.

---

## Part 1 — The `generator` block

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}
```

- **What it does:** tells Prisma to generate the Client (the query code) and *where* to put
  it — here, `app/generated/prisma`.
- **Why `output` is set:** by default Prisma 7 puts the client inside `node_modules`. This
  project instead generates it into the repo at `app/generated/prisma` (that's why
  `lib/prisma.ts` imports from `@/app/generated/prisma`). That folder is git-ignored and
  re-created by `npx prisma generate` — you don't edit it by hand.

---

## Part 2 — The `datasource` block

```prisma
datasource db {
  provider = "postgresql"
}
```

- **What it does:** says which kind of database you're using — **PostgreSQL**.
- **Why there's no `url` here:** in most tutorials you'd see `url = env("DATABASE_URL")` on
  this block. In *this* project the connection URL is provided in two other places instead:
  - `prisma.config.ts` (`datasource.url`) — used by the Prisma **CLI** (migrate, studio, seed).
  - `lib/prisma.ts` (the driver adapter's `connectionString`) — used by the **app at runtime**.
  This is the modern Prisma 7 driver-adapter setup. Keeping the URL out of the schema avoids
  having it in two places. (You already set this up in Phase 0 — now you know *why*.)

---

## Part 3 — Enums

```prisma
enum Role {
  ADMIN
  CUSTOMER
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
}
```

- **What an enum is:** a column that can only hold one value from a fixed list. `Role` is
  always either `ADMIN` or `CUSTOMER` — never anything else.
- **Why use enums:** they make invalid data *impossible*. The database itself rejects a
  user with `role = "BANANA"`. That's much safer than a free-text column where typos slip in.
- Where they're used: `User.role` and `Appointment.status` (below).

---

## Part 4 — The `User` model

```prisma
model User {
  id           String @id @default(cuid())
  firstName    String
  lastName     String
  email        String @unique
  phone        String
  address      String
  password     String
  role         Role @default(CUSTOMER)
  appointments Appointment[]
  createdAt    DateTime @default(now())
}
```

Field by field:

| Field | Meaning & the "why" |
|---|---|
| `id String @id @default(cuid())` | The **primary key** — a unique ID for each user. `@id` marks it as the identifier. `@default(cuid())` auto-generates a collision-resistant random ID (like `cmabc123…`). *Why cuid instead of 1,2,3?* Sequential numbers leak how many users you have and are easy to guess in URLs; cuids don't. |
| `firstName / lastName / phone / address String` | Plain required text columns. `String` with no `?` means **required** (cannot be empty/null). |
| `email String @unique` | Text, but `@unique` means **no two users can share an email**. The database enforces this — a second signup with the same email is rejected. This is what makes email usable as a login identifier later. |
| `password String` | Stores the password. ⚠️ It will hold a **hashed** password (scrambled), never the real text — you'll see this in the seed script, and we do it properly in Phase 2 (auth). |
| `role Role @default(CUSTOMER)` | Uses the `Role` enum. `@default(CUSTOMER)` means new users are customers unless you say otherwise — so you can't accidentally create an admin. |
| `appointments Appointment[]` | **This is a relation, not a column.** The `[]` means "a user has *many* appointments." There's no `appointments` column in the database — Prisma uses this to let you write `user.appointments`. (The actual link lives on the `Appointment` side, below.) |
| `createdAt DateTime @default(now())` | A timestamp set automatically when the row is created. Great for sorting "newest first." |

---

## Part 5 — The `Appointment` model

```prisma
model Appointment {
  id              String @id @default(cuid())
  appointmentDate DateTime
  status          AppointmentStatus @default(PENDING)
  notes           String?
  userId          String
  user            User @relation(fields: [userId], references: [id])
  createdAt       DateTime @default(now())
}
```

| Field | Meaning & the "why" |
|---|---|
| `id` | Same idea as `User.id` — the appointment's primary key. |
| `appointmentDate DateTime` | When the appointment is scheduled for. Required. |
| `status AppointmentStatus @default(PENDING)` | Uses the enum. New appointments start as `PENDING` until an admin confirms or cancels them — exactly the workflow we'll build. |
| `notes String?` | The **`?` makes it optional** (nullable). A user *may* add notes, or leave them out. Compare to `String` (required) above — the `?` is the whole difference. |
| `userId String` | The **foreign key** — the actual column that stores *which* user this appointment belongs to. It holds that user's `id`. |
| `user User @relation(fields: [userId], references: [id])` | The **relation definition**. It says: "the `userId` field on this table points to the `id` field on the `User` table." This is the other half of `User.appointments`. |
| `createdAt` | When the appointment row was created (not the same as `appointmentDate`!). |

### How the two sides of the relation fit together

```
User.appointments  (many)  ←──────┐   "one user has many appointments"
                                   │
Appointment.userId  ──────────────┘   "each appointment belongs to one user"
Appointment.user   (the link back)
```

This is a **one-to-many** relationship: one user → many appointments. The database stores
the link as the `userId` column on `Appointment`. Prisma's `user` and `appointments`
fields are conveniences that let you travel the relation in code, e.g.:

```ts
// get a user AND their appointments in one query
prisma.user.findUnique({ where: { id }, include: { appointments: true } });
```

---

## Quick self-check (answer these in your Notes)

You understand the schema if you can answer:

1. What makes `email` different from `phone`? (Hint: an attribute.)
2. Why does `notes` have a `?` but `appointmentDate` doesn't?
3. Which field is the *foreign key* on `Appointment`, and what does it store?
4. Is `appointments` on `User` a real database column? Why or why not?
5. Why are passwords stored as `String` but never as the real password text?

If any feel shaky, re-read that part — then move on to Task 2 in `foundation.md`.

---

## Read more

- Prisma — Data model: <https://www.prisma.io/docs/orm/prisma-schema/data-model/models>
- Prisma — Relations: <https://www.prisma.io/docs/orm/prisma-schema/data-model/relations>
- Prisma — IDs & `cuid()`: <https://www.prisma.io/docs/orm/reference/prisma-schema-reference#cuid>