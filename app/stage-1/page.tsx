import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/routes"

export default function Stage1Page() {
  redirect(ROUTES.app)
}
