// src/lib/prismaDB.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;

  if (!url) {
    // Fail fast — better than returning null and crashing later
    throw new Error(
      "DATABASE_URL is not set. Please define it in your environment (.env)."
    );
  }

  const adapter = new PrismaPg({
    connectionString: url,
  });

  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
