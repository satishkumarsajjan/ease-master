import { CONSENT_KEY } from "./consent"

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(CONSENT_KEY) === "accepted"
}
