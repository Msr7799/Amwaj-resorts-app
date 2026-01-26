// import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// TODO: Add Countdown model to schema.prisma then uncomment prisma queries
export const getCountdowns = unstable_cache(
  async () => {
    return [];
  },
  ['countdowns'], { tags: ['countdowns'] }
);