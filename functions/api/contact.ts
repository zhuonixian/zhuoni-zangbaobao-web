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

async function getTenantToken(appId: string, appSecret: string): Promise<string> {
  const resp = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const data = await resp.json<{ tenant_access_token: string }>();
  return data.tenant_access_token;
}

async function sendMessage(token: string, chatId: string, content: string): Promise<void> {
  await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id", {
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
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_CHAT_ID } = context.env;

  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET || !FEISHU_CHAT_ID) {
    return new Response(JSON.stringify({ error: "服务未配置" }), { status: 500 });
  }

  let form: FormData;
  const contentType = context.request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    form = await context.request.json<FormData>();
  } else {
    const formData = await context.request.formData();
    form = {
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      message: formData.get("message") as string,
    };
  }

  if (!form.name || !form.message) {
    return new Response(JSON.stringify({ error: "姓名和留言内容为必填项" }), { status: 400 });
  }

  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const atTag = FEISHU_AT_USER_ID
    ? `<at user_id="${FEISHU_AT_USER_ID}">俞卓玛</at>`
    : `<at user_id="all">所有人</at>`;
  const text = [
    `${atTag} 📬 藏宝宝官网收到新留言`,
    "",
    `👤 姓名：${form.name}`,
    form.phone ? `📱 电话：${form.phone}` : "",
    form.email ? `📧 邮箱：${form.email}` : "",
    "",
    `💬 留言：${form.message}`,
    "",
    `🕐 时间：${now}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const token = await getTenantToken(FEISHU_APP_ID, FEISHU_APP_SECRET);
    await sendMessage(token, FEISHU_CHAT_ID, text);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "发送失败，请稍后重试" }), { status: 500 });
  }
};
