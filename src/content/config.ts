import { defineCollection, z } from 'astro:content';

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    topics: z.array(z.string()),
    featured: z.boolean().default(true),
    order: z.number().optional(),
    badge: z.string().optional(),
    links: z.array(linkSchema),
  }),
});

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    courseCode: z.string(),
    subtitle: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    topics: z.array(z.string()),
    year: z.number().optional(),
    order: z.number().optional(),
    badge: z.string().optional(),
    links: z.array(linkSchema),
  }),
});

export const collections = { projects, courses };
