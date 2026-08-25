# 03 — E2E tests for interscript.org website

## Priority: P0

## Problem
The website has integration tests (Vitest) that test individual modules,
but no browser-based E2E tests that validate the actual user experience:
loading pages, typing in transliteration inputs, seeing output.

## Solution: Playwright

### Setup
```bash
cd interscript.org
npm install -D @playwright/test
npx playwright install
```

### Structure
```
e2e/
  playwright.config.ts
  home.spec.ts           # Landing page loads, CTA works
  detect.spec.ts         # Detect panel: input → system suggestion
  compare.spec.ts        # Compare two systems side by side
  batch.spec.ts          # Batch transliteration
  maps.spec.ts           # Browse maps, search, filter
  api-docs.spec.ts       # API documentation interactive
  worker.spec.ts         # Web Worker loads and transliterates
```

### Key Test Cases

#### Worker transliteration (critical path)
```typescript
test("worker transliterates Ukrainian", async ({ page }) => {
  await page.goto("/")
  const input = page.locator("[data-testid='translit-input']")
  const output = page.locator("[data-testid='translit-output']")
  await input.fill("Антон")
  await expect(output).toContainText("Anton")
})
```

#### Map browser
```typescript
test("browse maps by script", async ({ page }) => {
  await page.goto("/maps")
  await page.click("text=Cyrillic")
  await expect(page.locator(".map-card")).toHaveCount.greaterThan(10)
})
```

#### API playground
```typescript
test("API playground returns JSON", async ({ page }) => {
  await page.goto("/api")
  await page.fill("[data-testid='api-input']", '{"system":"bgnpcgn-ukr-Cyrl-Latn-2019","input":"Київ"}')
  await page.click("[data-testid='api-run']")
  await expect(page.locator("[data-testid='api-output']")).toContainText("Kyiv")
})
```

### CI Integration
```yaml
# .github/workflows/e2e.yml
- name: Build site
  run: npm run build
- name: Run Playwright
  run: npx playwright test
- name: Upload report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```
