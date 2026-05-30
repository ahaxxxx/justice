const DEFAULT_API_BASE_URL = "https://justice-snowy-ten.vercel.app";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
  /\/$/,
  ""
);

export async function createVerdict(payload) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/verdict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("无法连接到猫猫法庭后端，请检查后端部署地址。");
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "请求失败，请稍后再试。");
  }

  return data;
}
