#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把微信公众号文章导入 src/content/insights。用法：
   python3 scripts/import-wechat.py <slug> <mp.weixin.qq.com/s/... 链接> [tags,逗号分隔] [related,逗号分隔]
图片下载到 public/wx/<slug>/，正文转 Markdown，front matter 里 sourceUrl 指向公众号原文。
已存在的文件：只重写 <!-- wechat-body --> 之后的正文，保留 front matter 里手改的 tags/related。"""
import sys, re, html, os, io, urllib.request, datetime, hashlib
slug, url = sys.argv[1], sys.argv[2]
tags = sys.argv[3] if len(sys.argv) > 3 else ''
related = sys.argv[4] if len(sys.argv) > 4 else ''
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
def get(u, referer=None):
    req = urllib.request.Request(u, headers={'User-Agent': UA, **({'Referer': referer} if referer else {})})
    return urllib.request.urlopen(req, timeout=60).read()
t = get(url).decode('utf-8', 'replace')
title = re.sub(r'\s+', ' ', html.unescape(re.search(r'<meta property="og:title" content="([^"]*)"', t).group(1))).strip()
author = (re.search(r'<meta name="author" content="([^"]*)"', t) or [None, ''])[1].strip()
url = url.split('?')[0]
digest = re.search(r'var msg_desc = htmlDecode\("([^"]*)"\)', t)
digest = digest.group(1) if digest else ''
digest = re.sub(r'\\x([0-9a-fA-F]{2})', lambda m: chr(int(m.group(1), 16)), digest)
digest = html.unescape(html.unescape(digest))
_o = True; _out = []
for _ch in digest:
    if _ch == '"': _out.append('“' if _o else '”'); _o = not _o
    else: _out.append(_ch)
digest = ''.join(_out)
ct = re.search(r'var ct = "(\d+)"', t)
date = datetime.datetime.utcfromtimestamp(int(ct.group(1))).strftime('%Y-%m-%d') if ct else datetime.date.today().isoformat()
body = re.search(r'id="js_content"[^>]*>(.*?)</div>\s*<script', t, re.S).group(1)
# images
imgdir = f'public/wx/{slug}'; os.makedirs(imgdir, exist_ok=True); n = 0
def img_sub(m):
    global n
    tag = m.group(0); src = re.search(r'data-src="([^"]+)"', tag)
    if not src: return ''
    u = html.unescape(src.group(1)); fmt = re.search(r'wx_fmt=(\w+)', u); ext = {'jpeg': 'jpg'}.get(fmt.group(1), fmt.group(1)) if fmt else 'jpg'
    n += 1; fn = f'{n:02d}.{ext}'; path = f'{imgdir}/{fn}'
    if not os.path.exists(path):
        try: open(path, 'wb').write(get(u, referer='https://mp.weixin.qq.com/'))
        except Exception as e: print('image failed', u[:80], e); return ''
    return f'\n\n![](/wx/{slug}/{fn})\n\n'
b = re.sub(r'<img[^>]*>', img_sub, body)
b = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', b, flags=re.S)
b = re.sub(r'<br\s*/?>', '\n', b)
for lvl, md in (('1', '## '), ('2', '## '), ('3', '### '), ('4', '### ')):
    b = re.sub(rf'<h{lvl}[^>]*>(.*?)</h{lvl}>', lambda m: f'\n\n{md}' + re.sub(r'<[^>]+>', '', m.group(1)).strip() + '\n\n', b, flags=re.S)
b = re.sub(r'<(strong|b)[^>]*>(.*?)</\1>', lambda m: '**' + re.sub(r'<[^>]+>', '', m.group(2)).strip() + '**' if m.group(2).strip() else '', b, flags=re.S)
b = re.sub(r'<(em|i)[^>]*>(.*?)</\1>', lambda m: '*' + re.sub(r'<[^>]+>', '', m.group(2)).strip() + '*' if m.group(2).strip() else '', b, flags=re.S)
b = re.sub(r'<blockquote[^>]*>(.*?)</blockquote>', lambda m: '\n\n> ' + re.sub(r'<[^>]+>', '', m.group(1)).strip().replace('\n', '\n> ') + '\n\n', b, flags=re.S)
b = re.sub(r'<li[^>]*>(.*?)</li>', lambda m: '\n- ' + re.sub(r'<[^>]+>', '', m.group(1)).strip(), b, flags=re.S)
b = re.sub(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', lambda m: f'[{re.sub(r"<[^>]+>", "", m.group(2)).strip()}]({html.unescape(m.group(1))})' if m.group(2).strip() else '', b, flags=re.S)
b = re.sub(r'</(p|section|div)>', '\n\n', b)
b = re.sub(r'<[^>]+>', '', b)
b = html.unescape(b).replace('\xa0', ' ')
b = re.sub(r'[ \t]+', ' ', b); b = re.sub(r' *\n *', '\n', b); b = re.sub(r'\n{3,}', '\n\n', b).strip()
b = re.sub(r'\*\*\s*\*\*', '', b)
b = re.sub(r'"([^"\n]+)"', r'“\1”', b)
# drop trailing promo lines typical of 公众号
b = re.split(r'\n(?:—+\s*)?(?:关于清链|关于我们|欢迎关注|扫码关注|点击关注|往期推荐|推荐阅读)', b)[0].strip()
fm = f'''---
title: "{title.replace('"', '”')}"
subtitle: "{digest.replace('"', '”')}"
author: "{author or '清链学堂在线'}"
date: {date}
source: wechat
sourceUrl: "{url}"
tags: [{tags}]
related: [{related}]
---

'''
out = f'src/content/insights/{slug}.md'
if os.path.exists(out):
    cur = io.open(out, encoding='utf-8').read()
    if '<!-- wechat-body -->' in cur: fm = cur.split('<!-- wechat-body -->')[0]
io.open(out, 'w', encoding='utf-8').write(fm + '<!-- wechat-body -->\n' + b + '\n')
print(f'{out}: {title} | {date} | {len(b)} chars | {n} images | 作者 {author}')
