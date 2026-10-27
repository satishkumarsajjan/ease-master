import { getRedis } from "@/lib/redis"

const RATE_LIMIT_PREFIX = "satisium:ratelimit"
const WINDOW_SECONDS = 60
const MAX_REQUESTS = 30

export async function checkRateLimit(identifier: string): Promise<boolean> {
  try {
    const redis = getRedis()
    const key = `${RATE_LIMIT_PREFIX}:${identifier}`
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, WINDOW_SECONDS)
    }
    return count <= MAX_REQUESTS
  } catch {
    return true
  }
}
