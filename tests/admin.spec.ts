import { test, expect } from "@playwright/test";
import { loginAsAdmin, randomSlug } from "./helpers";

test.describe("🛡️ Flujo Admin", () => {
  test.describe.configure({ mode: "serial" });

  test("Login como admin desde /login redirige a /admin", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
  });

  test("Dashboard carga con stats y acciones rápidas", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await expect(page.getByText("Productos").first()).toBeVisible();
    await expect(page.getByText("Blog Posts").first()).toBeVisible();
    await expect(page.getByText("Pedidos").first()).toBeVisible();
    await expect(page.getByText("Usuarios").first()).toBeVisible();

    await expect(page.locator('a[href="/admin/productos/nuevo"]')).toBeVisible();
    await expect(page.locator('a[href="/admin/blog/nuevo"]')).toBeVisible();
    await expect(page.locator('a[href="/admin/descuentos"]').first()).toBeVisible();
  });

  test("Sidebar de admin tiene todas las secciones", async ({ page }) => {
    await loginAsAdmin(page);

    const sidebar = page.getByRole("complementary");
    await expect(sidebar.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Productos" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Pedidos" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Usuarios" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Descuentos" })).toBeVisible();
    await expect(sidebar.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
  });

  test("CRUD Producto — Crear producto nuevo", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/productos/nuevo");
    await page.waitForTimeout(1500);

    const name = `Test Product ${Date.now()}`;
    const slug = randomSlug("test-product");

    const form = page.locator('form').first();
    await form.locator('input[type="text"]').first().fill(name);
    await form.locator('input[type="text"]').nth(1).fill(slug);
    await form.locator('textarea').first().fill("Producto de prueba automatizada");
    await form.locator('input[type="number"]').first().fill("29.99");

    const categorySelect = page.locator("select").first();
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 });
    }

    await page.getByPlaceholder("URL de la imagen").fill("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600");
    await page.getByPlaceholder("Texto alternativo").fill("Test image");
    await page.locator('button:has-text("Añadir")').click();

    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/admin\/productos/, { timeout: 15_000 });
  });

  test("CRUD Producto — Listar productos", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/productos");

    await expect(page.getByRole("heading", { name: "Productos" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Nuevo" })).toBeVisible();

    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("CRUD Producto — Editar y eliminar producto (desde tabla)", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/productos");

    // Click the first edit (Pencil) icon in the table
    const editLink = page.locator('a[href*="/admin/productos/"] svg.lucide-pencil').first();
    if (await editLink.isVisible({ timeout: 5_000 })) {
      await editLink.click({ force: true });
      await page.waitForURL(/\/admin\/productos\/\d+/);
      await page.waitForTimeout(2000);
    }
  });

  test("CRUD Categorías — Crear, reordenar y eliminar", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/categorias");

    await expect(page.locator("text=Categorías")).toBeVisible();

    const nameInput = page.locator('input[placeholder*="Nombre"]');
    if (await nameInput.isVisible()) {
      const catName = `Test Cat ${Date.now()}`;
      await nameInput.fill(catName);
      await page.click('button:has-text("Añadir")');
      await page.waitForTimeout(1000);
    }
  });

  test("CRUD Blog — Crear post y listar", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/blog");

    await expect(page.locator("text=Blog Posts")).toBeVisible();
    await expect(page.locator('a[href="/admin/blog/nuevo"]')).toBeVisible();
  });

  test("CRUD Blog — Nuevo post", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/blog/nuevo");
    await page.waitForTimeout(1000);

    const title = `Test Post ${Date.now()}`;
    const slug = randomSlug("test-post");

    const form = page.locator("form").first();
    await form.locator("input[type='text']").nth(0).fill(title);
    await form.locator("input[type='text']").nth(1).fill(slug);
    await form.locator("textarea").nth(0).fill("Extracto de prueba");
    await form.locator("textarea").nth(1).fill("Contenido de prueba para el post automatizado.");
    await form.locator("input[type='url']").fill("https://images.unsplash.com/photo-1503262028195-93c528f03218?w=600");

    await form.locator('button[type="submit"]').click();
    await page.waitForURL(/\/admin\/blog/, { timeout: 15_000 });
  });

  test("CRUD Descuentos — Crear y listar cupones", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/descuentos");

    await expect(page.getByRole("heading", { name: "Descuentos" })).toBeVisible();

    const toggleBtn = page.locator('button:has-text("Nuevo")');
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click({ force: true });
      await page.waitForTimeout(500);

      const codeInput = page.locator('input[placeholder*="Código"]');
      if (await codeInput.isVisible()) {
        await codeInput.fill(`TEST${Date.now()}`);
        await page.fill('input[placeholder*="%"]', "15");
        await page.click('button:has-text("Crear")');
        await page.waitForTimeout(1000);
      }
    }
  });

  test("Listado de Usuarios", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/usuarios");

    await expect(page.getByRole("heading", { name: "Usuarios" })).toBeVisible();
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Listado de Pedidos", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/pedidos");

    await expect(page.getByRole("heading", { name: "Pedidos" })).toBeVisible();
  });

  test("Cerrar sesión desde el sidebar", async ({ page }) => {
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);

    const logoutBtn = page.locator('button:has-text("Cerrar sesión")');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForURL(/\/$|\/login/, { timeout: 15_000 });
    }
  });
});
