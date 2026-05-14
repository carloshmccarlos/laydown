import { test, expect } from "@playwright/test";
import { attachErrorGuards, resetBrowserState, submitScenario } from "./helpers";

async function savePlanFromScenario(
  page: import("@playwright/test").Page,
  mode: "current_projection" | "target_projection",
  incomeType: "with_salary" | "without_salary"
) {
  await submitScenario(page, { mode, incomeType });
  await page.getByTestId("save-plan-button").click();
  await expect(page.getByText("已保存")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await resetBrowserState(page);
});

test("compare page asks for at least two plans when empty", async ({ page }) => {
  const assertNoErrors = attachErrorGuards(page);

  await page.goto("/compare");
  await expect(page.getByText("请至少选择 2 个方案进行对比")).toBeVisible();
  await page.getByRole("button", { name: "返回方案列表" }).click();
  await expect(page).toHaveURL(/\/plans$/);

  await assertNoErrors();
});

test("plans can be saved, searched, renamed, duplicated, deleted, and compared", async ({ page }) => {
  const assertNoErrors = attachErrorGuards(page);

  await savePlanFromScenario(page, "current_projection", "with_salary");
  await savePlanFromScenario(page, "target_projection", "without_salary");

  await page.goto("/plans");
  await expect(page.getByRole("heading", { name: "我的方案" })).toBeVisible();
  await expect(page.getByText("已保存方案")).toBeVisible();

  await page.getByTestId("plan-search-input").fill("目标");
  await expect(page.getByText(/目标.*方案/).first()).toBeVisible();
  await page.getByTestId("plan-search-input").fill("");

  await page.getByTestId("rename-plan-button").first().click();
  await page.getByTestId("plan-name-input").fill("测试方案 A");
  await page.keyboard.press("Enter");
  await expect(page.getByText("测试方案 A").first()).toBeVisible();

  await page.getByTestId("duplicate-plan-button").first().click();
  await expect(page.getByText(/复制/).first()).toBeVisible();

  await page.getByTestId("delete-plan-button").last().click();
  await expect(page.getByText("已保存方案")).toBeVisible();

  const toggles = page.getByTestId("toggle-compare-plan");
  await toggles.nth(0).click();
  await toggles.nth(1).click();
  await page.getByTestId("start-compare-button").click();

  await expect(page).toHaveURL(/\/compare$/);
  await expect(page.getByRole("heading", { name: "方案对比" })).toBeVisible();
  await expect(page.getByText("资金曲线对比")).toBeVisible();
  await expect(page.getByText("推荐方案")).toBeVisible();

  await assertNoErrors();
});
