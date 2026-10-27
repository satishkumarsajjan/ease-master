import { Redis } from "@upstash/redis"
import { env, features } from "@/lib/env"

/** Minimal in-memory stand-in for the commands we use. */
function createMemoryRedis() {
  const store = new Map<string, { value: number; expiresAt: number | null }>()
  const alive = (key: string) => {
    const entry = store.get(key)
    if (!entry) return null
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      store.delete(key)
      return null
    }
    return entry
  }

  return {
    async incr(key: string) {
      const entry = alive(key) ?? { value: 0, expiresAt: null }
      entry.value += 1
      store.set(key, entry)
      return entry.value
    },
    async expire(key: string, seconds: number) {
      const entry = store.get(key)
      if (entry)
        store.set(key, { ...entry, expiresAt: Date.now() + seconds * 1000 })
      return 1
    },
    async zincrby(...args: unknown[]) {
      void args
      return 1
    },
    async zremrangebyrank(...args: unknown[]) {
      void args
      return 0
    },
  }
}

let client: ReturnType<typeof createMemoryRedis> | Redis | null = null

export function getRedis() {
  if (client) return client

  if (features.telemetryStore) {
    client = new Redis({
      url: env.UPSTASH_REDIS_REST_URL as string,
      token: env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  } else {
    // Zero-key path: rate limiting still works, it just does not survive a restart.
    client = createMemoryRedis()
  }

  return client
}
