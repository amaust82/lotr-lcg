import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', m => { if (m.type() !== 'debug') console.log('console:', m.type(), m.text()); });

// Create a campaign
await page.goto('http://localhost:5178/campaigns');
await page.waitForLoadState('networkidle');
await page.locator('#campaign-name').fill('Debug Test');
await page.locator('.btn-create').click();
await page.waitForURL('**/campaigns/**');
await page.waitForLoadState('networkidle');

// Add player + hero
await page.locator('text=+ Add Player').click();
await page.waitForTimeout(200);
await page.locator('text=+ Add Hero').first().click();
await page.waitForTimeout(300);

const cbInput = page.locator('.cb-input').first();
console.log('Input exists:', await cbInput.count() > 0);
const box = await cbInput.boundingBox();
console.log('Input bounding box:', JSON.stringify(box));

// Click to open
await cbInput.click();
await page.waitForTimeout(300);

const ariaExpanded = await cbInput.getAttribute('aria-expanded');
console.log('aria-expanded:', ariaExpanded);

const listCount = await page.locator('.cb-list').count();
console.log('cb-list in DOM:', listCount);

if (listCount > 0) {
  const listBox = await page.locator('.cb-list').first().boundingBox();
  console.log('cb-list bounding box:', JSON.stringify(listBox));
  const listVisible = await page.locator('.cb-list').first().isVisible();
  console.log('cb-list visible:', listVisible);
  const itemCount = await page.locator('.cb-opt').count();
  console.log('dropdown items:', itemCount);
}

await page.screenshot({ path: 'ss-hero-cb.png', fullPage: true });
await browser.close();
