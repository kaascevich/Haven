import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

const songs = defineCollection({
  type: "data",
  schema: () =>
    z.object({
      title: z.string(),
      composer: z.string().optional(),
    }),
});

export const collections = {
  "blog": blog,
  "songs": songs,
};
