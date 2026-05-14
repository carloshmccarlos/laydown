import { expect, Page } from "@playwright/test";

export function attachErrorGuards(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return async () => {
    expect(errors).toEqual([]);
  };
}

export async function resetBrowserState(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

export async function submitScenario(
  page: Page,
  options: {
    mode: "current_projection" | "target_projection";
    incomeType: "with_salary" | "without_salary";
  }
) {
  await page.goto("/setup");
  await page.getByTestId(options.mode === "current_projection" ? "mode-current" : "mode-target").click();
  await page.getByTestId(options.incomeType === "with_salary" ? "income-with-salary" : "income-without-salary").click();
  await page.getByTestId("start-calculation").click();
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByRole("heading", { name: "测算结果" })).toBeVisible();
  await expect(page.getByText("年龄-资金曲线")).toBeVisible();
}

export async function setRangeValue(page: Page, testId: string, value: number) {
  await page.getByTestId(testId).evaluate(
    (element, nextValue) => {
      const input = element as HTMLInputElement;
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      valueSetter?.call(input, String(nextValue));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    value
  );
}
