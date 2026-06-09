import type { Page } from "@playwright/test";

export const ADMIN_CREDS = {
  email: "admin@ryoku.es",
  password: "admin123",
};

export const TEST_USER = {
  name: "Test Usuario",
  email: `test-${Date.now()}@ryoku.es`,
  password: "TestPass1",
};

export function randomSlug(prefix = "test") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("tu@email.com").fill(ADMIN_CREDS.email);
  await page.locator('input[type="password"]').fill(ADMIN_CREDS.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/admin/, { timeout: 15_000 });
}

export async function loginAsUser(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}
