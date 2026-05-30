const { requestDeepSeekVerdict } = require("../lib/deepseek");
const { setCorsHeaders } = require("../lib/cors");
const { checkRateLimit, getClientIp } = require("../lib/rateLimit");
const { validateVerdictInput } = require("../lib/validate");

async function readJsonBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 32_000) {
        reject(new Error("REQUEST_BODY_TOO_LARGE"));
      }
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "只支持 POST 请求" });
    return;
  }

  let body;

  try {
    body = await readJsonBody(req);
  } catch (error) {
    res.status(400).json({ message: "请求格式不正确，请提交 JSON 数据" });
    return;
  }

  const validation = validateVerdictInput(body);

  if (!validation.ok) {
    res.status(400).json({ message: validation.message });
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
    res.status(429).json({ message: "请求过于频繁，请稍后再试" });
    return;
  }

  try {
    const verdict = await requestDeepSeekVerdict(validation.data);
    res.status(200).json(verdict);
  } catch (error) {
    console.error("DeepSeek verdict failed:", error);
    res.status(500).json({
      message: "猫猫法官暂时离席，请稍后再试",
    });
  }
};

