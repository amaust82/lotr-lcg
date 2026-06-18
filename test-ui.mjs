import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', m => console.log('console:', m.type(), m.text()));

// Screenshot the campaigns page
await page.goto('http://localhost:5178/campaigns');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'ss-campaigns.png', fullPage: true });
console.log('Campaigns page screenshotted');

// Check button state before typing
const btn = page.locator('.btn-create');
console.log('Button disabled initially:', await btn.isDisabled());

// Type a name
await page.locator('#campaign-name').fill('Test Campaign');
await page.waitForTimeout(100);
console.log('Button disabled after typing:', await btn.isDisabled());
await page.screenshot({ path: 'ss-campaigns-typed.png', fullPage: true });

// Submit to create a campaign
await page.locator('#campaign-name').fill('Test');
await btn.click();
await page.waitForTimeout(500);
console.log('URL after submit:', page.url());
await page.screenshot({ path: 'ss-after-create.png', fullPage: true });

await browser.close();
