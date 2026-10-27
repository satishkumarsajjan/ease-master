import { MetadataRoute } from "next"
import { PRODUCT } from "@/lib/config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PRODUCT.name,
    short_name: PRODUCT.shortName,
    description: PRODUCT.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
