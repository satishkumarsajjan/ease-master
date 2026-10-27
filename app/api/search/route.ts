import { source } from "@/lib/source"
import { createSearchAPI } from "fumadocs-core/search/server"

const searchAPI = createSearchAPI("advanced", {
  indexes: source.getPages().map((page) => ({
    title: page.data.title,
    description: page.data.description,
    structuredData: page.data.structuredData,
    id: page.url,
    url: page.url,
  })),
})

export async function GET(req: Request) {
  return searchAPI.GET(req)
}
