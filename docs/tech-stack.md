# 技术栈

## 前端

- Vinext (Cloudflare) — Next.js API surface on Vite, App Router
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts

## 构建与部署

- **Vinext** — Vite-based build tool, replaces Next.js compiler
- **Cloudflare Workers** — SSR 部署目标，通过 `vinext deploy`
- **@cloudflare/vite-plugin** — Workers 原生集成，绑定 D1/R2/KV 等
- **Wrangler** — Workers 配置和部署

## 状态与数据

- Zustand 管理测算输入、结果、保存方案和对比选择。
- localStorage 持久化保存方案和对比选择。
- 所有计算在浏览器本地完成，不上传个人财务数据。

## 表单与校验

- React Hook Form
- Zod
- `@hookform/resolvers`
- 百分比字段在界面按百分比展示和输入，计算引擎内部使用小数。

## 海报生成

- html2canvas
- 仅在用户点击"生成海报"时运行。
- 捕获结果页有效内容区域，不包含保存、对比、重新测算等操作按钮。

## 测试

- ESLint：`pnpm lint`
- TypeScript：`pnpm exec tsc --noEmit`
- Vinext build：`pnpm build`
- Playwright E2E：`pnpm test:e2e`

## 约束

- 只能使用 pnpm，不能使用 npm 或 bun。
- 不做旧版本兼容，必要时可以破坏旧数据结构。
- 每个文件最多 1 个 React 组件。
- 页面说明文案保持克制，不新增未请求的前端内容。
- `public/google7cfc68ab913bcd14.html` 必须存在。

# Result page rewrite notes - 2026-05-14

- No new runtime dependencies are required for the result page rewrite.
- Continue using Next.js App Router, React, TypeScript, Tailwind CSS, Lucide React, Recharts, Zustand, and html2canvas.
- Use `pnpm` only for verification commands.

# Vinext Migration - 2026-05-14

- Replaced Next.js compiler with vinext (Cloudflare's Vite-based Next.js reimplementation).
- Deploy target changed from Cloudflare Pages (static export) to Cloudflare Workers (SSR).
- Build tool: `vinext build` instead of `next build`.
- Development server: `vinext dev` instead of `next dev`.
- RSC, SSR, and client environments are handled by `@vitejs/plugin-rsc`.
- `cloudflare:workers` module provides Workers bindings in server components and route handlers.
- Static crawler files (`robots.txt`, `sitemap.xml`, `llms.txt`, etc.) remain in `public/`.
- `next.config.ts` and `next-env.d.ts` removed; all Next.js-specific build configuration is gone.
- `next/font/google` replaced with standard Google Fonts CSS import in `globals.css`.
- ESLint config updated to remove `eslint-config-next`; uses standard `@typescript-eslint` rules.
- `package.json` scripts unified: `dev`, `build`, `start` all point to vinext commands.
