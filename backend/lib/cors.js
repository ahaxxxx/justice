const LOCAL_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

function isGitHubPagesOrigin(origin) {
  try {
    const { hostname, protocol } = new URL(origin);

    return protocol === "https:" && hostname.endsWith(".github.io");
  } catch {
    return false;
  }
}

function getConfiguredOrigins() {
  return (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function getAllowedOrigin(requestOrigin) {
  if (!requestOrigin) {
    return "*";
  }

  const normalizedOrigin = requestOrigin.replace(/\/$/, "");
  const configuredOrigins = getConfiguredOrigins();

  if (
    configuredOrigins.includes("*") ||
    configuredOrigins.includes(normalizedOrigin) ||
    LOCAL_ORIGINS.has(normalizedOrigin) ||
    isGitHubPagesOrigin(normalizedOrigin)
  ) {
    return normalizedOrigin;
  }

  if (configuredOrigins.length > 0) {
    return configuredOrigins[0];
  }

  return normalizedOrigin;
}

function setCorsHeaders(req, res) {
  const origin = getAllowedOrigin(req.headers.origin || "");

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

module.exports = {
  setCorsHeaders,
};
