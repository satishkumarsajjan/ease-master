"use client"

import { logger } from "@/lib/logger"

type ToastOptions = { description?: string }

// Zero-dependency toast fallback conforming to §3.2 (package.json has no sonner)
const toastShim = Object.assign(
  (msg: string, opts?: ToastOptions) => {
    logger.info("[toast]", msg, opts)
    return msg
  },
  {
    success: (msg: string, opts?: ToastOptions) => {
      logger.info("[toast:success]", msg, opts)
      return msg
    },
    error: (title: string, opts?: ToastOptions) => {
      logger.error("[toast:error]", title, opts)
      return title
    },
    loading: (msg: string, opts?: ToastOptions) => {
      logger.info("[toast:loading]", msg, opts)
      return msg
    },
    dismiss: (...args: unknown[]) => {
      void args
    },
    promise: <T>(p: Promise<T>, ...args: unknown[]) => {
      void args
      return p
    },
  }
)

/**
 * Brand-consistent toasts. Product code calls `notify.*`, never `toast.*` directly,
 * so copy and styling stay uniform (and can be re-branded in one place).
 */
export const notify = {
  copied: (what = "Copied") =>
    toastShim(what, { description: "In your clipboard." }),
  saved: (what = "Saved") => toastShim.success(what),
  created: (what: string) => toastShim.success(`${what} created`),
  deleted: (what: string) => toastShim.success(`${what} deleted`),
  info: (message: string) => toastShim(message),
  loading: (message: string) => toastShim.loading(message),
  invalid: (message: string) =>
    toastShim.error("That didn't work", { description: message }),
  failed: (message: string) =>
    toastShim.error("Something went wrong", { description: message }),
  dismiss: toastShim.dismiss,
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toastShim.promise(promise, messages),
}
