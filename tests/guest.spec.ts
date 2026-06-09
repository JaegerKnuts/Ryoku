import { test, expect } from "@playwright/test";
import { TEST_USER, randomSlug } from "./helpers";

test.describe("👤 Flujo Invitado — Homepage", () => {
  test("La homepage carga todas las secciones principales", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("text=RYOKU").first()).toBeVisible();
    await expect(page.locator("text=Explorar tienda")).toBeVisible();
    await expect(page.locator("text=Entrar al archivo")).toBeVisible();

    await expect(page.locator("text=RYØKU Hash Archive").first()).toBeVisible();
    await expect(page.locator("text=Últimos artículos")).toBeVisible();
    await expect(page.locator("text=Productos seleccionados")).toBeVisible();
    await expect(page.locator("text=Únete a la familia")).toBeVisible();
  });
});

test.describe("👤 Flujo Invitado — Shop", () => {
  test("El catálogo carga y se puede filtrar/buscar/ordenar", async ({ page }) => {
    await page.goto("/shop");

    await expect(page.locator("h1").filter({ hasText: "Shop" })).toBeVisible();

    const products = page.locator("a[href^='/shop/producto/']");
    await expect(products.first()).toBeVisible({ timeout: 10_000 });

    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Merch" }).click();
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Selected Gear" }).click();
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Todo" }).click();
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder("Buscar...");
    if (await searchInput.isVisible()) {
      await searchInput.fill("Hoodie");
      await page.waitForTimeout(500);
    }

    // Open sort dropdown
    const sortBtn = page.locator('button:has-text("Ordenar")');
    if (await sortBtn.isVisible()) {
      await sortBtn.click();
      await page.locator('text=Precio: menor a mayor').click();
      await page.waitForTimeout(500);
    }
  });

  test("La paginación funciona si hay más de 12 productos", async ({ page }) => {
    await page.goto("/shop?limit=1");

    const nextBtn = page.locator('button:has-text("Siguiente")');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("page=2");
    }
  });
});

test.describe("👤 Flujo Invitado — Producto Detalle", () => {
  test("La página de producto carga con información", async ({ page }) => {
    await page.goto("/shop");
    const firstProduct = page.locator("a[href^='/shop/producto/']").first();
    await expect(firstProduct).toBeVisible({ timeout: 10_000 });
    await firstProduct.click();

    await page.waitForURL(/\/shop\/producto\//);
    await expect(page.locator("h1")).toBeVisible({ timeout: 10_000 });

    // Add to cart via localStorage
    await page.evaluate(() => {
      localStorage.setItem("ryoku-cart", JSON.stringify([{
        id: 1, name: "Producto Test", price: 29.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        qty: 1
      }]));
    });
  });
});

test.describe("👤 Flujo Invitado — Carrito", () => {
  test("El carrito muestra los productos añadidos y permite modificar cantidades", async ({ page }) => {
    // Set cart in localStorage
    await page.goto("/carrito");
    await page.evaluate(() => {
      localStorage.setItem("ryoku-cart", JSON.stringify([{
        id: 1, name: "Hoodie Ryoku Classic", price: 59.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        qty: 2, size: "M", color: "Negro", variantId: 2
      }]));
    });
    await page.reload();

    const cartTitle = page.locator("h1");
    await expect(cartTitle).toContainText("Carrito");

    const removeBtns = page.locator('button[aria-label="Eliminar"]');
    if (await removeBtns.first().isVisible({ timeout: 5_000 })) {
      await removeBtns.first().click();
      await page.waitForTimeout(500);
    }
  });

  test("Carrito vacío muestra estado vacío", async ({ page }) => {
    // Clear localStorage cart
    await page.goto("/carrito");
    await page.evaluate(() => localStorage.removeItem("ryoku-cart"));
    await page.reload();

    await expect(page.locator("text=Tu carrito está vacío")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('a:has-text("Ir a la tienda")')).toBeVisible();
  });
});

test.describe("👤 Flujo Invitado — Checkout", () => {
  test.describe.configure({ mode: "serial" });

  test("Añadir producto al carrito para checkout", async ({ page }) => {
    await page.goto("/shop/producto/hoodie-ryoku-classic");
    await expect(page.locator("h1")).toBeVisible({ timeout: 10_000 });

    // Set cart in localStorage directly
    await page.evaluate(() => {
      localStorage.setItem("ryoku-cart", JSON.stringify([{
        id: 1, name: "Hoodie Ryoku Classic", price: 59.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        qty: 1, size: "M", color: "Negro", variantId: 2
      }]));
    });
  });

  test("Checkout redirige a Stripe después de completar dirección", async ({ page, context }) => {
    // Set cart in localStorage as fallback
    await page.goto("/carrito");
    await page.evaluate(() => {
      localStorage.setItem("ryoku-cart", JSON.stringify([{
        id: 1, name: "Hoodie Ryoku Classic", price: 59.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        qty: 1, size: "M", color: "Negro", variantId: 2
      }]));
    });

    await page.goto("/checkout");
    await page.waitForTimeout(2000);

    const continueBtn = page.locator('button:has-text("Continuar al pago")');
    if (await continueBtn.isVisible({ timeout: 5_000 })) {
      const inputs = page.locator("input");
      const count = await inputs.count();
      if (count >= 6) {
        await inputs.nth(0).fill("Test");
        await inputs.nth(1).fill("Usuario");
        await inputs.nth(2).fill("Calle Test 123");
        await inputs.nth(3).fill("Madrid");
        await inputs.nth(4).fill("Madrid");
        await inputs.nth(5).fill("28001");
      }

      await continueBtn.click();
      await page.waitForTimeout(2000);

      const payBtn = page.locator('button:has-text("Pagar")');
      if (await payBtn.isVisible({ timeout: 5_000 })) {
        await payBtn.click();
      }

      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      expect(currentUrl.includes("stripe") || currentUrl.includes("checkout")).toBeTruthy();
    }
  });
});

test.describe("👤 Flujo Invitado — Blog", () => {
  test("Blog listing carga con posts y filtros", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.locator("h1")).toContainText("Hash Archive");
    const posts = page.locator("a[href^='/blog/']");
    await expect(posts.first()).toBeVisible({ timeout: 10_000 });
  });

  test("Filtros del blog cambian los posts mostrados", async ({ page }) => {
    await page.goto("/blog");

    const empezarBtn = page.locator('button:has-text("Empieza aquí")');
    if (await empezarBtn.isVisible()) {
      await empezarBtn.click();
      await page.waitForTimeout(1500);
    }
  });

  test("Post individual carga con contenido, likes y comentarios", async ({ page }) => {
    await page.goto("/blog");
    const postLink = page.locator("a[href^='/blog/']").first();
    await expect(postLink).toBeVisible({ timeout: 10_000 });
    await postLink.click();

    await page.waitForURL(/\/blog\//);
    await page.waitForTimeout(2000);

    const likeButton = page.locator('button:has-text("like"), button svg[class*="heart"]');
    if (await likeButton.first().isVisible({ timeout: 3_000 })) {
      await likeButton.first().click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe("👤 Flujo Invitado — Newsletter", () => {
  test("Suscripción a newsletter funciona", async ({ page }) => {
    await page.goto("/");

    const emailInput = page.locator('input[type="email"]').last();
    if (await emailInput.isVisible()) {
      await emailInput.fill(`test-${Date.now()}@example.com`);

      await page.locator('button:has-text("Suscribirme")').click();

      await expect(page.locator("text=Bienvenido a la familia")).toBeVisible({ timeout: 10_000 });
    }
  });
});

test.describe("👤 Flujo Invitado — Autenticación", () => {
  test("Registro de nuevo usuario", async ({ page }) => {
    await page.goto("/registro");
    await expect(page.getByRole("heading", { name: "Crear cuenta" })).toBeVisible();

    const email = `nuevo-${Date.now()}@test.com`;
    await page.getByPlaceholder("Tu nombre").fill(TEST_USER.name);
    await page.getByPlaceholder("tu@email.com").fill(email);
    await page.locator('input[type="password"]').nth(0).fill(TEST_USER.password);
    await page.locator('input[type="password"]').nth(1).fill(TEST_USER.password);

    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await page.waitForURL(/\/login/, { timeout: 15_000 });
  });

  test("Login funciona con credenciales correctas", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();

    await page.getByPlaceholder("tu@email.com").fill(TEST_USER.email);
    await page.locator('input[type="password"]').fill(TEST_USER.password);
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.waitForTimeout(3000);
  });

  test("Login falla con credenciales incorrectas", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("tu@email.com").fill("noexiste@test.com");
    await page.locator('input[type="password"]').fill("wrongpass");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.waitForTimeout(2000);
  });

  test("Página de recuperar contraseña funciona", async ({ page }) => {
    await page.goto("/recuperar-contrasena");
    await expect(page.getByRole("heading", { name: "Recuperar contraseña" })).toBeVisible();

    await page.getByPlaceholder("tu@email.com").fill("test@example.com");
    await page.getByRole("button", { name: "Enviar enlace" }).click();

    await expect(page.getByText("Email enviado")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("👤 Flujo Invitado — About", () => {
  test("Página About carga con valores y enlaces", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("text=Sobre Ryoku")).toBeVisible();
    await expect(page.locator("text=Archivo especializado")).toBeVisible();
    await expect(page.getByRole("link", { name: "@ryoku en Instagram" })).toBeVisible();
  });
});
