type Entry = { count: number; resetAt: number };

const globalStore = globalThis as unknown as {
  inquiryRateLimit?: Map<string, Entry>;
};
const store = globalStore.inquiryRateLimit || new Map<string, Entry>();
globalStore.inquiryRateLimit = store;

export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= limit)
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000)
    };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}
