import { test, expect } from "@playwright/test";
import { attachErrorGuards, resetBrowserState, setRangeValue, submitScenario } from "./helpers";

test.beforeEach(async ({ page }) => {
  await resetBrowserState(page);
});

test("setup supports all four calculation scenarios", async ({ page }) => {
  const assertNoErrors = attachErrorGuards(page);

  for (const mode of ["current_projection", "target_projection"] as const) {
    for (const incomeType of ["with_salary", "without_salary"] as const) {
      await submitScenario(page, { mode, incomeType });
      await expect(page.getByText(incomeType === "with_salary" ? "月收入（税后）" : "当前存款").first()).toBeVisible();
    }
  }

  await assertNoErrors();
});

test("setup handles city presets, detailed expenses, advanced settings, and salary toggles", async ({ page }) => {
  const assertNoErrors = attachErrorGuards(page);

  await page.goto("/setup");
  await page.getByTestId("city-select").selectOption("chengdu");
  await expect(page.getByTestId("monthly-expense-input")).toHaveValue("8500");

  await page.getByTestId("expense-mode-breakdown").click();
  const values = {
    rentOrMortgage: 3000,
    food: 2000,
    transport: 500,
    communication: 100,
    clothing: 400,
    medical: 300,
    insurance: 200,
    entertainmentEducation: 500,
    familySupport: 300,
    other: 200,
  };

  for (const [key, value] of Object.entries(values)) {
    await page.getByTestId(`expense-item-${key}`).fill(String(value));
  }
  await expect(page.getByText("¥7,500")).toBeVisible();

  await page.getByTestId("salary-income-input").fill("22222");
  await page.getByTestId("income-without-salary").click();
  await expect(page.getByTestId("salary-income-input")).toHaveCount(0);
  await page.getByTestId("advanced-toggle").click();
  await expect(page.getByTestId("salary-growth-input")).toHaveCount(0);
  await page.getByTestId("advanced-toggle").click();
  await page.getByTestId("income-with-salary").click();
  await expect(page.getByTestId("salary-income-input")).toHaveValue("22222");

  await page.getByTestId("advanced-toggle").click();
  await page.getByTestId("salary-stop-age-input").fill("20");
  await page.getByTestId("start-calculation").click();
  await expect(page.getByText("停止工作年龄必须大于当前年龄")).toBeVisible();

  await page.getByTestId("salary-stop-age-input").fill("");
  await page.getByTestId("inflation-rate-input").fill("");
  await page.getByTestId("advanced-toggle").click();
  await page.getByTestId("start-calculation").click();
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByText("¥7,500").first()).toBeVisible();

  await assertNoErrors();
});

test("result page simulator, save action, and poster generation work without console errors", async ({ page }) => {
  const assertNoErrors = attachErrorGuards(page);

  await submitScenario(page, { mode: "current_projection", incomeType: "with_salary" });
  await expect(page.getByText("滑杆模拟")).toBeVisible();
  await expect(page.getByRole("heading", { name: "调整建议" })).toBeVisible();

  await setRangeValue(page, "simulator-monthlyExpense", 20000);
  await expect(page.getByText("¥20,000").first()).toBeVisible();

  await page.getByTestId("save-plan-button").click();
  await expect(page.getByText("已保存")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("generate-poster-button").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("幸福生活测算结果");

  await assertNoErrors();
});
