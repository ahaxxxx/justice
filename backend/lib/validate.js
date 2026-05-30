function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function validateVerdictInput(body) {
  const sideA = normalizeText(body?.sideA);
  const sideB = normalizeText(body?.sideB);
  const background = normalizeText(body?.background);

  if (!sideA || !sideB) {
    return {
      ok: false,
      message: "请填写 A 方和 B 方观点",
    };
  }

  if (sideA.length > 4000 || sideB.length > 4000 || background.length > 3000) {
    return {
      ok: false,
      message: "内容太长了，请稍微精简后再提交",
    };
  }

  return {
    ok: true,
    data: {
      sideA,
      sideB,
      background,
    },
  };
}

module.exports = {
  validateVerdictInput,
};

