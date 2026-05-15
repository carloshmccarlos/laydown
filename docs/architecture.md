# 架构设计

## 总览

项目是纯前端 vinext 应用（Next.js API surface on Vite）。用户输入进入 Zustand store，经计算引擎生成结果，再由结果页、方案页和对比页展示。保存方案和对比选择只写入 localStorage。

```text
/setup 输入
  -> calculatorStore.formState
  -> calculateResult(formState, city)
  -> calculatorStore.result
  -> /result 展示、模拟、保存、生成海报
  -> /plans 管理保存方案
  -> /compare 对比已选方案
```

## 计算模型

- `simulation.ts` 负责逐年模拟。
- `calculator.ts` 负责四种场景分发：现状/目标 × 有薪资/无薪资。
- `suggestions.ts` 负责调整建议。
- `risk.ts` 负责风险判断。
- `living-level.ts` 负责生活等级推导。

本轮将支出增长率替换为通货膨胀率：

- 表单字段为 `annualInflationRate`。
- 逐年模拟时，月支出按通货膨胀率增长。
- 无薪资收入场景不使用薪资增长率。
- 风险判断比较通胀率与可用收入增长率。

## 数据模型

- `CalculatorFormState` 保留当前生活等级推导所需字段，不再保留目标生活等级。
- `ExpenseBreakdown` 保存详细支出拆分。
- `CalculatorResult` 只返回 `currentLivingLevel`，页面文案统一显示为“生活等级”。
- 删除分享结果相关类型和 URL 编码流程。

## 页面职责

- `/setup` 只负责收集输入、校验和提交计算。
- `/result` 负责展示当前结果、滑杆模拟、调整建议、保存方案、生成海报。
- `/plans` 是方案和方案对比的入口。
- `/compare` 只处理已选方案的对比展示。

## 测试策略

- Playwright 测试覆盖首页、设置页、结果页、方案页、对比页、FAQ 和 Demo。
- 测试必须覆盖四种测算场景，以及城市切换、详细支出、高级设置、停止工作年龄错误、无薪资切换、结果页滑杆模拟、保存方案、生成海报。
- 每个 E2E 测试监听页面错误和 console error，发现未预期错误即失败。
# Result page rewrite architecture - 2026-05-14

- `/result` remains the page-level orchestrator for store hydration, recalculation, and poster capture boundaries.
- Result display stays split across one-component-per-file modules in `src/components/result`.
- The page layout follows the reference image order: headline and steps, three outcome cards, info strip, chart plus summary, key metrics, simulator, suggestions/actions, and recalculation CTA.
- Existing calculation, store, save, compare, and poster-generation contracts remain unchanged.

# SEO/GEO Architecture - 2026-05-14

- Global SEO lives in `src/app/layout.tsx` through Next metadata (via vinext).
- Static crawler files live in `public` and are served by Cloudflare Workers.
- `llms.txt` gives AI search systems a concise product summary, canonical page list, and keyword context.
- The favicon and app icon are SVG assets in `public`, referenced from metadata without changing page UI.
- Cloudflare Workers serves the app via SSR using `vinext deploy`.

# Vinext / Cloudflare Workers Architecture - 2026-05-14

- Full architecture diagram now flows through vinext's Vite pipeline instead of Next.js compiler.
- `vite.config.ts` configures vinext, `@vitejs/plugin-rsc` (for App Router RSC/SSR/client), and `@cloudflare/vite-plugin`.
- RSC environment runs in workerd (Cloudflare Workers runtime) for dev, with full `cloudflare:workers` bindings support.
- SSR and client environments bundle separately via Vite's multi-environment build.
- `wrangler.jsonc` defines Workers config (compatibility flags, bindings, etc.).
- Deployment: `vinext deploy` builds and deploys to Workers in one command.
