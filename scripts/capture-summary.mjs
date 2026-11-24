import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = process.argv[2] ?? "http://localhost:3000";
const outputDir = "screenshots/summary";

const tabs = [
  ["By susceptibility", "susceptibility"],
  ["By risk", "risk"],
  ["Observed floods", "observed-floods"],
  ["Validation", "validation"],
  ["Trigger now/+48 h", "trigger"],
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 380, height: 1000 },
  deviceScaleFactor: 2,
});

await page.goto(baseURL, { waitUntil: "networkidle" });
await page.locator("text=Key numbers").waitFor();

const panel = page.locator("section").filter({ hasText: "Key numbers" });

for (const [tabLabel, fileName] of tabs) {
  await page.getByRole("button", { name: tabLabel, exact: true }).click();
  await page.waitForTimeout(100);

  await panel.screenshot({
    path: `${outputDir}/${fileName}.png`,
    animations: "disabled",
  });

  console.log(`${outputDir}/${fileName}.png`);
}

await browser.close();
