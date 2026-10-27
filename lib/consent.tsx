"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react"
import { logger } from "@/lib/logger"

type ConsentStatus = "pending" | "accepted" | "declined"

interface ConsentContextValue {
  status: ConsentStatus
  isInitialized: boolean
  accept: () => void
  decline: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export const CONSENT_KEY = "satisium-analytics-consent"

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return "pending"
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored === "accepted") return "accepted"
    if (stored === "declined") return "declined"
  } catch (e) {
    logger.error("Failed to read consent from localStorage", e)
  }
  return "pending"
}

const consentListeners = new Set<() => void>()

function subscribeConsent(callback: () => void) {
  consentListeners.add(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY) callback()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    consentListeners.delete(callback)
    window.removeEventListener("storage", onStorage)
  }
}

function notifyConsentListeners() {
  for (const listener of consentListeners) {
    listener()
  }
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const isInitialized = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const status = useSyncExternalStore<ConsentStatus>(
    subscribeConsent,
    getStoredConsent,
    () => "pending"
  )

  const accept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted")
    } catch (e) {
      logger.error("Failed to write consent to localStorage", e)
    }
    notifyConsentListeners()
  }, [])

  const decline = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined")
    } catch (e) {
      logger.error("Failed to write consent to localStorage", e)
    }
    notifyConsentListeners()
  }, [])

  const value = useMemo(
    () => ({ status, isInitialized, accept, decline }),
    [status, isInitialized, accept, decline]
  )

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider")
  return ctx
}
