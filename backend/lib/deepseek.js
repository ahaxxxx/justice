const { buildVerdictPrompt, SYSTEM_PROMPT } = require("./prompt");

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

function parseJsonFromModel(content) {
  if (!content) {
    throw new Error("EMPTY_MODEL_RESPONSE");
  }

  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch ? fencedMatch[1] : content;
  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("MODEL_RESPONSE_NOT_JSON");
  }

  return JSON.parse(jsonText.slice(start, end + 1));
}

function clampPercent(value, fallback) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

function toText(value, fallback) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value.trim();
}

function normalizeVerdict(rawVerdict) {
  const source = rawVerdict && typeof rawVerdict === "object" ? rawVerdict : {};
  const responsibilityA = clampPercent(source.responsibilityA, 50);
  const rawResponsibilityB = clampPercent(source.responsibilityB, 100 - responsibilityA);
  const responsibilityB =
    responsibilityA + rawResponsibilityB === 100 ? rawResponsibilityB : 100 - responsibilityA;

  return {
    rootCause: toText(source.rootCause, "双方真正需要处理的，是期待没有被说清楚。"),
    responsibilityA,
    responsibilityB,
    verdict: toText(source.verdict, "猫猫法官认为：先暂停互相证明谁更委屈，改成一起说明自己真正需要什么。"),
    reconciliationTask: toText(source.reconciliationTask, "双方各用一分钟复述对方的感受，再提出一个今天就能做到的小行动。"),
    relationshipScore: clampPercent(source.relationshipScore, 75),
  };
}

async function requestDeepSeekVerdict(input) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("MISSING_DEEPSEEK_API_KEY");
  }

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildVerdictPrompt(input),
        },
      ],
      temperature: 0.75,
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DEEPSEEK_API_ERROR_${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = parseJsonFromModel(content);

  return normalizeVerdict(parsed);
}

module.exports = {
  requestDeepSeekVerdict,
};
