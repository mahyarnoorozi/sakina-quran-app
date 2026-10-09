#!/usr/bin/env node
/* Capture console + hydration errors from the app */
const path = require("path");
function loadPlaywright() {
  try { return require("playwright"); } catch (_) {}
  const { execSync } = require("child_process");
  const g = execSync("npm root -g").toString().trim();
  return require(path.join(g, "playwright", "package.json")) && require(require("path").join(g, "playwright"));
}
(async () => {
  const pw = loadPlaywright();
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  page.on("console", (m) => console.log("[console:" + m.type() + "]", m.text().slice(0, 300)));
  page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 400)));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  const hasOnboarding = await page.evaluate(() =>
    !!Array.from(document.querySelectorAll("p")).find((p) => p.textContent.includes("پناهگاه"))
  );
  console.log("onboarding rendered:", hasOnboarding);
  await browser.close();
})();
