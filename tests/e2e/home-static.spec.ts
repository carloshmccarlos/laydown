import { test, expect } from "@playwright/test";
import { attachErrorGuards, resetBrowserState } from "./helpers";

test.beforeEach(async ({ page }) => {
  await resetBrowserState(page);
});

test("home, faq, demo, and navigation entries work", async ({ page }) => {
  const assertNoErrors = attachErrorGuards(page);

  await page.goto("/");
  await expect(page.locator('main a[href="/setup"]').first()).toBeVisible();
  await expect(page.locator('main a[href="/demo"]').first()).toBeVisible();

  if ((await page.locator('a[href="/plans"]:visible').count()) === 0) {
    await page.getByRole("button", { name: "打开导航菜单" }).click();
  }
  await page.locator('a[href="/plans"]:visible').first().click();
  await expect(page).toHaveURL(/\/plans$/);
  await expect(page.getByRole("heading", { name: "我的方案" })).toBeVisible();

  await page.goto("/faq");
  await expect(page.getByRole("heading", { name: "常见问题", exact: true })).toBeVisible();
  await expect(page.getByText("可以保存多个方案吗？")).toBeVisible();

  await page.goto("/demo");
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByRole("heading", { name: "测算结果" })).toBeVisible();

  await assertNoErrors();
});
