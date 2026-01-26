// import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// TODO: Add Category model to schema.prisma then uncomment prisma queries
// get all categories
export const getCategories = unstable_cache(
  async () => {
    return [];
  },
  ['categories'], { tags: ['categories'] }
);

// GET CATEGORY BY SLUG
export const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    return null;
  },
  ['categories'], { tags: ['categories'] }
);

// GET CATEGORY BY ID
export const getCategoryById = unstable_cache(
  async (id: number) => {
    return null;
  },
  ['categories'], { tags: ['categories'] }
);