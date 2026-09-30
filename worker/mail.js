// Copied from the simulator project (液冷仿真/functions/_lib/mail.js). Gmail SMTP 发信（Cloudflare Worker，走 cloudflare:sockets 的隐式 TLS，smtp.gmail.com:465）
//
// sendMail(env, { to, subject, text, html, replyTo }) → { sent:true, ms } | { sent:false, reason:'not_configured' }
// 环境变量：GMAIL_USER（登录账号，jim.li@nextgenergy.ai）、GMAIL_APP_PASSWORD（应用专用密码，Secret）、
//           REPORT_FROM（From/Reply-To，默认 sales@nextgenergy.ai，是 jim.li@ 的别名）。
// 失败一律 throw，错误信息只含 SMTP 状态码与阶段，不含凭据、不含对端回显的完整行。
// 出处：Workers TCP sockets https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/ ；
//       Gmail SMTP 规则 https://knowledge.workspace.google.com/admin/gmail/send-email-from-a-printer-scanner-or-app

import { connect } from 'cloudflare:sockets';

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465;
const TIMEOUT_MS = 10000;
const DEFAULT_FROM = 'sales@nextgenergy.ai';

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64(str) {
  const bytes = enc.encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
const wrap76 = (s) => s.replace(/(.{76})/g, '$1\r\n');
// RFC 2047：非 ASCII 的头部值用 =?UTF-8?B?...?=；每个 encoded-word ≤ 60 字符（36 字节一段，连同 "Subject: " 前缀不超 78），多段用折行空格连接，不拆多字节字符
function encHeader(s) {
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  const words = [];
  let cur = '';
  for (const ch of s) {
    if (enc.encode(cur + ch).length > 36) {
      words.push(`=?UTF-8?B?${b64(cur)}?=`);
      cur = '';
    }
    cur += ch;
  }
  if (cur) words.push(`=?UTF-8?B?${b64(cur)}?=`);
  return words.join('\r\n ');
}
// 只允许 "Name <addr>" 或 "addr"；地址部分不能有换行/尖括号以外的控制字符
function parseAddr(s) {
  // 两种写法：裸地址 `a@b`，或 `名字 <a@b>`（名字不含 @）。原来的单条正则名字组是贪婪的，
  // 会把 sim@nextgenergy.ai 拆成 名字 "si" + 地址 "m@nextgenergy.ai"（2026-09-25 Jim 自测时退信暴露）。
  const t = String(s || '').trim();
  const ADDR = /^[^\s<>@",;]+@[^\s<>@",;]+\.[^\s<>@",;]+$/;
  let m = t.match(/^"?([^"<>\r\n@]*?)"?\s*<([^\s<>@",;]+@[^\s<>@",;]+\.[^\s<>@",;]+)>$/);
  if (m) return { name: m[1].trim(), addr: m[2] };
  if (ADDR.test(t)) return { name: '', addr: t };
  throw new Error('mail: bad address');
}
const fmtAddr = ({ name, addr }) => (name ? `${encHeader(name)} <${addr}>` : addr);
const strip = (s) => String(s || '').replace(/[\r\n]+/g, ' ');

export function buildMime({ from, to, replyTo, subject, text, html }) {
  const boundary = `=_nge_${crypto.randomUUID().replace(/-/g, '')}`;
  const msgId = `<${crypto.randomUUID()}@${from.addr.split('@')[1]}>`;
  const head = [
    `From: ${fmtAddr(from)}`,
    `To: ${fmtAddr(to)}`,
    replyTo ? `Reply-To: ${fmtAddr(replyTo)}` : null,
    `Subject: ${encHeader(strip(subject))}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${msgId}`,
    'MIME-Version: 1.0',
    'X-Mailer: nextgenergy-ai/worker',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean);
  const part = (ctype, body) => [`--${boundary}`, `Content-Type: ${ctype}; charset=UTF-8`, 'Content-Transfer-Encoding: base64', '', wrap76(b64(body))].join('\r\n');
  const body = [part('text/plain', text || ''), html ? part('text/html', html) : null, `--${boundary}--`, ''].filter((x) => x !== null).join('\r\n');
  return head.join('\r\n') + '\r\n\r\n' + body;
}

// ---- 极简 SMTP 客户端 ----
class Smtp {
  constructor(socket) {
    this.socket = socket;
    this.writer = socket.writable.getWriter();
    this.reader = socket.readable.getReader();
    this.buf = '';
  }
  async read() {
    // 一个响应可能多行（250-xxx ... 250 xxx）；最后一行是 "ddd " 开头
    for (;;) {
      const lines = this.buf.split('\r\n');
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^\d{3} /.test(lines[i])) {
          this.buf = lines.slice(i + 1).join('\r\n');
          return { code: Number(lines[i].slice(0, 3)), lines: lines.slice(0, i + 1) };
        }
      }
      const { value, done } = await this.reader.read();
      if (done) throw new Error('smtp: connection closed');
      this.buf += dec.decode(value, { stream: true });
      if (this.buf.length > 65536) throw new Error('smtp: response too long');
    }
  }
  async cmd(line, expect, stage) {
    if (line !== null) await this.writer.write(enc.encode(line + '\r\n'));
    const r = await this.read();
    if (!expect.includes(r.code)) throw new Error(`smtp: ${stage} failed (${r.code})`);
    return r;
  }
  async close() {
    try { await this.writer.close(); } catch {}
    try { this.socket.close(); } catch {}
  }
}

export async function sendMail(env, { to, subject, text, html, replyTo }) {
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) return { sent: false, reason: 'not_configured' };
  const t0 = Date.now();
  const from = parseAddr(env.REPORT_FROM || DEFAULT_FROM);
  const rcpt = parseAddr(to);
  const reply = replyTo ? parseAddr(replyTo) : from;
  const mime = buildMime({ from, to: rcpt, replyTo: reply, subject, text, html });
  const data = mime.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..') + '\r\n.';   // dot-stuffing + 终止符

  let timer;
  const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error('smtp: timeout')), TIMEOUT_MS); });
  timeout.catch(() => {});                       // 会话先结束时这个 promise 无人等待，别变成 unhandled rejection
  let smtp;
  try {
    const socket = connect({ hostname: SMTP_HOST, port: SMTP_PORT }, { secureTransport: 'on', allowHalfOpen: false });
    smtp = new Smtp(socket);
    const session = (async () => {
      await smtp.cmd(null, [220], 'greeting');
      await smtp.cmd('EHLO nextgenergy.ai', [250], 'ehlo');
      await smtp.cmd('AUTH PLAIN ' + b64(`\u0000${env.GMAIL_USER}\u0000${env.GMAIL_APP_PASSWORD}`), [235], 'auth');
      await smtp.cmd(`MAIL FROM:<${from.addr}>`, [250], 'mail-from');
      await smtp.cmd(`RCPT TO:<${rcpt.addr}>`, [250, 251], 'rcpt-to');
      await smtp.cmd('DATA', [354], 'data');
      await smtp.cmd(data, [250], 'message');
      try { await smtp.cmd('QUIT', [221], 'quit'); } catch {}
    })();
    session.catch(() => {});                     // 同上：timeout 先触发时 session 的拒绝也要有人接
    await Promise.race([session, timeout]);
    return { sent: true, ms: Date.now() - t0 };
  } finally {
    clearTimeout(timer);
    if (smtp) await smtp.close();
  }
}
