# tsingchain.ai · 清链科技官网

Astro 源码。部署方式：**Cloudflare Workers Builds**，推送 `main` 后自动执行 `npx wrangler deploy`；`wrangler.jsonc` 先运行 `npm ci && npm run build`，再把 `./dist` 作为静态资产上传（Worker 名 `tsingchain-ai`）。

## 目录
- `src/pages/` 一个文件对应一个网址 · `src/data/` 文案与数字（site.ts、sections.ts、claims.ts、leakPoints.ts、cases.ts）· `src/content/insights/` 文章（Markdown，公众号导入）
- `public/` 原样输出：`_headers`（安全头）、`_redirects`、`robots.txt`、`security.txt`、logo、字体、头像、文章配图 `wx/`
- `scripts/import-wechat.py <slug> <公众号文章链接> [标签] [相关链接]` 导入公众号文章；`scripts/audit-mobile.mjs` 全站响应式与控制台检查

## 本地
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npx wrangler deploy --dry-run   # 校验部署配置并构建，不实际部署
```
Node 22.19（`.node-version`）。
