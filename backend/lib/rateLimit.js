const WINDOW_MS = 60 * 1000;
const rateLimitStore = globalThis.__justiceCatRateLimitStore || new Map();

globalThis.__justiceCatRateLimitStore = rateLimitStore;

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

function cleanup(now) {
  for (const [ip, timestamp] of rateLimitStore.entries()) {
    if (now - timestamp > WINDOW_MS * 2) {
      rateLimitStore.delete(ip);
    }
  }
}

function checkRateLimit(ip) {
  const now = Date.now();
  cleanup(now);

  const lastRequestAt = rateLimitStore.get(ip);

  if (lastRequestAt && now - lastRequestAt < WINDOW_MS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((WINDOW_MS - (now - lastRequestAt)) / 1000),
    };
  }

  rateLimitStore.set(ip, now);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

module.exports = {
  checkRateLimit,
  getClientIp,
};

