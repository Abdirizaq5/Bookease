import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
    await prisma.appointment.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("Password123!", 10);

const admin = await prisma.user.create({
    data: {
      firstName: "Ada",
      lastName: "Admin",
      email: "admin@bookease.com",
      phone: "+1000000000",
      address: "1 Admin Street",
      password: passwordHash,
      role: "ADMIN",
    },
  });

const customer = await prisma.user.create({
    data: {
         firstName: "Charlie",
      lastName: "Customer",
      email: "charlie@example.com",
      phone: "+1222222222",
      address: "22 Client Road",
      password: passwordHash,
      role: "CUSTOMER",
      appointments: {
        create: [
            {
                appointmentDate: new Date("2026-07-01T10:00:00Z"),
                status: "CONFIRMED",
                notes: "First consultation",
            },
            {
                appointmentDate: new Date("2026-07-15T14:30:00Z"),
                // status left out on purpose → it defaults to PENDING (from the schema)
                // notes left out on purpose → it's optional (String?) so this is fine
            },
        ],
      },
    },
  });
  console.log("✅ Seeded users:", admin.email, "and", customer.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });