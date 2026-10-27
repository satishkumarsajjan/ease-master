import { pageSchema } from "fumadocs-core/source/schema"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      component: z.boolean().default(false),

      hideToc: z.boolean().default(false),
      hideAside: z.boolean().default(false),
      hideCopy: z.boolean().default(false),
      comingSoon: z.boolean().default(false),
      wide: z.boolean().default(false),

      badge: z.enum(["new", "updated", "beta", "deprecated"]).optional(),
      author: z.string().optional(),
      date: z.string().optional(),
      links: z
        .object({
          preview: z.string().url().optional(),
          github: z.string().url().optional(),
        })
        .optional(),
      registryKeys: z.array(z.string()).optional(),
      media: z
        .object({
          image: z.string(),
          video: z.string().optional(),
        })
        .optional(),
    }),
  },
})

export const legal = defineDocs({ dir: "content/legal" })

export default defineConfig()
