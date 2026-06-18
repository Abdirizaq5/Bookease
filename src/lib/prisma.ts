// import { PrismaClient } from "@prisma/client";

// // Type augmentation for global Prisma instance
// declare global {
//   // Allow global `var` declarations
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// // Initialize Prisma client with connection pooling configuration
// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//     // Connection pooling configuration
//     // These settings apply when using connection pooling
//   });
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrismaClient = global as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// export const prisma: PrismaClientSingleton =
//   globalForPrismaClient.prisma ?? prismaClientSingleton();

// // Setup error event listeners
// prisma.$on("error", (e) => {
//   console.error("[Prisma Error]", e);
// });

// prisma.$on("warn", (e) => {
//   console.warn("[Prisma Warn]", e);
// });

// // Setup connection lifecycle logging in development
// if (process.env.NODE_ENV === "development") {
//   prisma.$on("query", (e) => {
//     console.log("[Prisma Query]", {
//       query: e.query,
//       duration: `${e.duration}ms`,
//       timestamp: e.timestamp,
//     });
//   });

//   console.log("[Prisma] Client initialized in development mode");
// }

// // Graceful shutdown handler
// const handleShutdown = async () => {
//   try {
//     await prisma.$disconnect();
//     console.log("[Prisma] Disconnected successfully");
//   } catch (error) {
//     console.error("[Prisma] Error during disconnect:", error);
//     process.exit(1);
//   }
// };

// // Register shutdown handlers
// process.on("SIGINT", handleShutdown);
// process.on("SIGTERM", handleShutdown);

// // Prevent instantiation of multiple Prisma clients in development
// if (process.env.NODE_ENV !== "production") {
//   globalForPrismaClient.prisma = prisma;
// }
