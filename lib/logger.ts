const isDev = process.env.NODE_ENV === "development"

export const logger = {
  error: (...args: unknown[]) => {
    if (isDev) {
      console.error("[Satisium Starter]", ...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn("[Satisium Starter]", ...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info("[Satisium Starter]", ...args)
    }
  },
}
