# 幸福生活计算器 PRD

## 产品定位

一个纯前端测算工具，帮助用户根据年龄、城市、收入、支出、存款、收益率和通货膨胀率，估算当前生活方式能维持到几岁，并给出可操作的调整建议。页面文案保持克制，优先呈现输入、结果和操作。

## 核心场景

- 按现状推算：用户想知道“我现在这样能维持到几岁”。
- 按目标推算：用户输入目标年龄，系统判断当前方案是否可维持到目标年龄。
- 有薪资收入：包含工资、自由职业、副业等主动收入。
- 无薪资收入：只依赖存款、投资收益、租金或其他被动收入。

## 本轮功能要求

- 月支出支持两种输入模式：
  - 总额输入：直接输入月支出总额。
  - 详细输入：依次输入居住、餐饮、交通、通信、衣服、医疗、保险、娱乐教育、家庭支持、其他，系统自动汇总为月支出。
- 城市切换时，基于城市成本预设重新填充月支出和详细支出拆分。
- 支出增长率统一改为通货膨胀率，计算时用于逐年放大支出。
- 无薪资收入场景不展示薪资增长率。
- 从“无薪资收入”切回“有薪资收入”时恢复上一次非 0 薪资输入。
- 高级设置允许留空，空值按默认值计算。
- 停止工作年龄必须有无效输入提示：必须大于当前年龄，且不超过最大模拟年龄。
- 删除目标生活等级相关输入和结果，只保留“生活等级”，由当前月支出和城市成本推导。
- 删除分享结果入口和分享链接能力。
- 保留海报生成，并生成结果页所有有效内容：核心结果、资金曲线、滑杆模拟、调整建议、摘要和关键指标。
- `/plans` 需要有入口；导航中的“方案对比”链接到 `/plans`，用户在方案页选择方案后进入 `/compare`。
- 结果页布局顺序：核心结果、资金曲线、滑杆模拟、调整建议。
- 调整建议保持两排等高卡片。
- 修复滑杆模拟时 React warning：不能在 `ScenarioSimulator` 渲染/状态更新过程中同步触发 `ResultPage` 的 state 更新。

## 数据与预设

- 城市和支出预设参考国家统计局公开数据：
  - 2026 年一季度居民消费支出结构。
  - 2026 年 4 月 CPI。
- 首版仍为纯前端本地计算，不接入后端和数据库。
- localStorage 用于保存方案和对比选择。

## 页面

- `/` 首页：入口、示例结果、生活等级介绍、方案入口。
- `/setup` 设置页：模式、收入类型、基础输入、高级设置、详细支出。
- `/result` 结果页：结论、资金曲线、模拟器、调整建议、保存和海报生成。
- `/plans` 我的方案：保存、搜索、筛选、重命名、复制、删除、加入对比。
- `/compare` 方案对比：至少两个方案的表格、图表和推荐方案。
- `/faq` 常见问题。
- `/demo` 示例结果。

## 测试要求

- 使用 Playwright 做全站功能测试，脚本为 `pnpm test:e2e`。
- 覆盖桌面 `1440x900` 和移动 `390x844`。
- Playwright 监听 `pageerror` 和 `console.error`，未预期错误必须失败。
- 保留 `pnpm lint`、`pnpm exec tsc --noEmit`、`pnpm build` 作为交付验证。
# Result page visual rewrite - 2026-05-14

- Rewrite `/result` to match the provided result-page reference image.
- Keep the existing result scope only: summary metrics, info bar, fund curve, result summary, key metrics, slider simulator, adjustment suggestions, plan actions, and final recalculation CTA.
- Reduce explanatory text and avoid adding new frontend content beyond the requested result page presentation.
- Preserve save, compare, poster generation, slider simulation, and recalculation behavior.

# SEO/GEO Update - 2026-05-14

- Change the browser and search title to `幸福生活计算器`.
- Keep `躺平` as a primary SEO keyword in metadata, AI-readable summaries, and crawler-facing files.
- Add GEO-oriented public files so AI crawlers can quickly understand the calculator, its use cases, and the canonical pages.
- Add a simple icon and favicon without adding new visible frontend page content.
- Preserve the required Google verification file at `/google7cfc68ab913bcd14.html`.
