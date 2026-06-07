interface Env {
  FEISHU_APP_ID: string;
  FEISHU_APP_SECRET: string;
  FEISHU_CHAT_ID: string;
  FEISHU_AT_USER_ID?: string;
}

interface FormData {
  name: string;
  phone?: string;
  email?: string;
  message: string;
}

const MAX_NAME_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_PHONE_LENGTH = 20;
const MAX_EMAIL_LENGTH = 100;
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

const ipTimestamps = new Map<string, number[]>();

function jsonResp(data: object, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipTimestamps.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (timestamps.length >= RATE_LIMIT_MAX) return false;
  timestamps.push(now);
  ipTimestamps.set(ip, timestamps);
  return true;
}

function validateForm(form: FormData): string | null {
  if (!form.name || form.name.trim().length === 0) return "姓名为必填项";
  if (form.name.length > MAX_NAME_LENGTH) return "姓名过长";
  if (!form.message || form.message.trim().length === 0) return "留言内容为必填项";
  if (form.message.length > MAX_MESSAGE_LENGTH) return "留言内容过长";
  if (form.phone && !/^[\d\s\-+()]{5,20}$/.test(form.phone)) return "电话号码格式不正确";
  if (form.email && (form.email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)))
    return "邮箱格式不正确";
  return null;
}

async function getTenantToken(appId: string, appSecret: string): Promise<string> {
  const resp = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const data = (await resp.json()) as { tenant_access_token?: string; code?: number; msg?: string };
  if (!data.tenant_access_token) {
    throw new Error(`Feishu auth failed: code=${data.code}, msg=${data.msg}`);
  }
  return data.tenant_access_token;
}

async function sendMessage(token: string, chatId: string, content: string): Promise<void> {
  const resp = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      receive_id: chatId,
      msg_type: "text",
      content: JSON.stringify({ text: content }),
    }),
  });
  const data = (await resp.json()) as { code?: number; msg?: string };
  if (data.code !== 0) {
    throw new Error(`Feishu send failed: code=${data.code}, msg=${data.msg}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get("Origin") || context.request.headers.get("Referer") || "";
  const allowedOrigins = ["https://zangbaobao-zhuonixian.pages.dev", "https://zhuonixian.pages.dev"];
  if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
    return jsonResp({ error: "请求来源不被允许" }, 403);
  }

  const clientIP = context.request.headers.get("CF-Connecting-IP") || "unknown";
  if (!checkRateLimit(clientIP)) {
    return jsonResp({ error: "请求过于频繁，请稍后再试" }, 429);
  }

  const { FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_CHAT_ID, FEISHU_AT_USER_ID } = context.env;
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET || !FEISHU_CHAT_ID) {
    return jsonResp({ error: "服务未配置" }, 500);
  }

  let form: FormData;
  const contentType = context.request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    form = await context.request.json<FormData>();
  } else {
    const formData = await context.request.formData();
    form = {
      name: (formData.get("name") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      message: (formData.get("message") as string) || "",
    };
  }

  const validationError = validateForm(form);
  if (validationError) {
    return jsonResp({ error: validationError }, 400);
  }

  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const atTag = FEISHU_AT_USER_ID
    ? `<at user_id="${FEISHU_AT_USER_ID}">俞卓玛</at>`
    : `<at user_id="all">所有人</at>`;
  const text = [
    `${atTag} 📬 藏宝宝官网收到新留言`,
    "",
    `👤 姓名：${form.name.slice(0, MAX_NAME_LENGTH)}`,
    form.phone ? `📱 电话：${form.phone.slice(0, MAX_PHONE_LENGTH)}` : "",
    form.email ? `📧 邮箱：${form.email.slice(0, MAX_EMAIL_LENGTH)}` : "",
    "",
    `💬 留言：${form.message.slice(0, MAX_MESSAGE_LENGTH)}`,
    "",
    `🕐 时间：${now}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const token = await getTenantToken(FEISHU_APP_ID, FEISHU_APP_SECRET);
    await sendMessage(token, FEISHU_CHAT_ID, text);
    return jsonResp({ ok: true }, 200);
  } catch {
    return jsonResp({ error: "发送失败，请稍后重试" }, 500);
  }
};
