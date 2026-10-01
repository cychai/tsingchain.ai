// tsingchain.ai Worker：提供 ./dist 静态站点，并处理一个接口 POST /api/contact。
//
// 联系表单流程：浏览器表单 → 本 Worker → Gmail SMTP（worker/mail.js）→ CONTACT_TO（默认 jim.li@nextgenergy.ai，Jim 2026-09-30 指定）。
// 不存储任何内容，询盘只存在于收件邮箱。
// Worker 上的密钥（Cloudflare → Workers → tsingchain-ai → Settings → Variables and secrets，放 Runtime，类型选 Secret）：
//   GMAIL_USER          jim.li@nextgenergy.ai（应用专用密码所属账号）
//   GMAIL_APP_PASSWORD  Google 应用专用密码（Secret；绝不写进 wrangler.jsonc，仓库是公开的）
//   REPORT_FROM         可选 From 地址，默认 sales@nextgenergy.ai（GMAIL_USER 的别名）
//   CONTACT_TO          可选收件人，默认 jim.li@nextgenergy.ai
// 两个密钥未配置时接口返回 503 not_configured，页面自动退回 mailto。
// 防垃圾：同源校验、隐藏蜜罐字段、最短填写时间、字段长度上限。不引入第三方脚本。

import { sendMail } from './mail.js';

const ALLOWED_HOSTS = /^(tsingchain\.ai|www\.tsingchain\.ai|[a-z0-9-]+\.workers\.dev|localhost(:\d+)?|127\.0\.0\.1(:\d+)?)$/i;
const TOPICS = new Set([
  '产品咨询或报价', '现场检测或运维', 'AI 算力中心新建', '既有数据中心液冷改造', '余热利用',
  '现有系统的调试或验证', '合作伙伴', '仿真台测试申请', '其他',
]);
const MAX_BODY = 16 * 1024;
const MIN_FILL_MS = 3000;
const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;
// eslint-disable-next-line no-control-regex

const STRIP = new RegExp('[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F-\\x9F\\u200B-\\u200F\\u2028\\u2029\\uFEFF]', 'g');

const HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: HEADERS });
const clean = (v, max) => (typeof v === 'string' ? v.replace(STRIP, '').trim().slice(0, max) : '');
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ');

function sameOrigin(request) {
  const src = request.headers.get('Origin') || request.headers.get('Referer');
  if (!src) return false;
  try { return ALLOWED_HOSTS.test(new URL(src).host); } catch { return false; }
}

async function contact(request, env) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' });
  if (!sameOrigin(request)) return json(403, { ok: false, error: 'origin' });
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY) return json(413, { ok: false, error: 'too_large' });
  let d;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'too_large' });
    d = JSON.parse(raw);
  } catch { return json(400, { ok: false, error: 'bad_json' }); }

  // Bots: a filled honeypot or an instant submit is accepted silently and dropped.
  if (clean(d.website, 200) || !(Number(d.elapsed) >= MIN_FILL_MS)) return json(200, { ok: true });

  const name = oneLine(clean(d.name, 120));
  const org = oneLine(clean(d.org, 160));
  const email = clean(d.email, 200);
  const topic = clean(d.topic, 80);
  const message = clean(d.message, 5000);
  const errors = [];
  if (!name) errors.push('name');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (!TOPICS.has(topic)) errors.push('topic');
  if (message.length < 10) errors.push('message');
  if (errors.length) return json(400, { ok: false, error: 'validation', fields: errors });

  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) return json(503, { ok: false, error: 'not_configured' });
  const subject = `[tsingchain.ai] ${topic} — ${name}${org ? '，' + org : ''}`;
  const phone = oneLine(clean(d.phone, 80));
  const text = `${message}\n\n—\n姓名：${name}\n单位：${org || '（未填）'}\n邮箱：${email}\n电话/微信：${phone || '（未填）'}\n需求类型：${topic}\n来自 tsingchain.ai 联系表单，${new Date().toISOString()}\n`;
  try {
    await sendMail(env, { to: env.CONTACT_TO || 'jim.li@nextgenergy.ai', replyTo: email, subject, text });
    console.log(JSON.stringify({ t: 'contact', ok: true, topic }));
    return json(200, { ok: true });
  } catch (e) {
    console.log(JSON.stringify({ t: 'contact', ok: false, err: String((e && e.message) || e).slice(0, 80) }));
    return json(502, { ok: false, error: 'upstream' });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return contact(request, env);
    return env.ASSETS.fetch(request);
  },
};
