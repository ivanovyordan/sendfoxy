# Sendfoxy

A web app for writing Sendfox email newsletters. Write in a Notion-like editor, copy the finished HTML, paste into Sendfox.

## How it works

1. Open the app and write your email content
2. Hit **Copy HTML** — the full email (with greeting, footer, and your content) is copied to clipboard
3. Paste into Sendfox's HTML editor

## Editor

- Type `/` to insert blocks — headings, lists, blockquotes, code blocks, dividers
- Select text to format it — bold, italic, underline, strikethrough, inline code, link
- Markdown shortcuts work too: `## ` → H2, `**bold**` → bold, `- ` → bullet list, etc.

The email template (greeting, sign-off, footer) is hardcoded and always present around your content.

## Dev

```bash
npm install
npm run dev       # start dev server at localhost:3000
npm run build     # build to dist/
npm run typecheck # type check only
```

## Stack

- React 19 + TypeScript + Vite
- Tiptap (Notion-like rich text editor)
- Tailwind CSS v4
- Deployed on Cloudflare Pages

## Deploy

Connect the repo in the Cloudflare Pages dashboard. Build command: `npm run build`. Output directory: `dist`.
