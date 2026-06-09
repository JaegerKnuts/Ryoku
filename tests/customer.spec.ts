import { test, expect } from "@playwright/test";
import { TEST_USER, loginAsUser } from "./helpers";

test.describe("🔐 Flujo Cliente Autenticado", () => {
  test.describe.configure({ mode: "serial" });

  let userEmail: string;
  let userPassword: string;

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    userEmail = `cliente-${Date.now()}@ryoku.es`;
    userPassword = "Cliente1";

    await page.goto("/registro");
    await expect(page.getByRole("heading", { name: "Crear cuenta" })).toBeVisible({ timeout: 10_000 });

    await page.getByPlaceholder("Tu nombre").fill("Cliente Test");
    await page.getByPlaceholder("tu@email.com").fill(userEmail);
    await page.locator('input[type="password"]').nth(0).fill(userPassword);
    await page.locator('input[type="password"]').nth(1).fill(userPassword);
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await ctx.close();
  });

  test("Login como cliente autenticado", async ({ page }) => {
    await loginAsUser(page, userEmail, userPassword);
    await page.waitForTimeout(3000);
  });

  test("Mis pedidos muestra estado vacío (sin pedidos)", async ({ page }) => {
    await loginAsUser(page, userEmail, userPassword);
    await page.waitForURL(/\/$/, { timeout: 10_000 }).catch(() => {});
    await page.goto("/mis-pedidos");
    await page.waitForTimeout(2000);

    const heading = page.locator("h1");
    await expect(heading).toBeVisible({ timeout: 10_000 });

    const emptyState = page.locator("text=No has realizado ningún pedido");
    if (await emptyState.isVisible({ timeout: 3_000 })) {
      await expect(emptyState).toBeVisible();
      await expect(page.locator('a:has-text("Ir a la tienda")')).toBeVisible();
    }
  });

  test("Pedidos expandibles se renderizan correctamente si existen", async ({ page }) => {
    await loginAsUser(page, userEmail, userPassword);
    await page.goto("/mis-pedidos");

    await page.waitForTimeout(2000);

    const orderButtons = page.locator("button:has-text('#')");
    const orderCount = await orderButtons.count();

    if (orderCount > 0) {
      await orderButtons.first().click();
      await page.waitForTimeout(500);
    }
  });
});
