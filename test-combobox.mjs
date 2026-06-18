import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('http://localhost:5178/campaigns');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'test-campaigns.png' });

const links = await page.locator('a[href^="/campaigns/"]').all();
console.log('Campaign links found:', links.length);

if (links.length > 0) {
  await links[0].click();
  await page.waitForLoadState('networkidle');

  const addPlayerBtn = page.locator('text=+ Add Player');
  if (await addPlayerBtn.isVisible()) {
    await addPlayerBtn.click();
    await page.waitForTimeout(300);
  }

  const addHeroBtn = page.locator('text=+ Add Hero').first();
  if (await addHeroBtn.isVisible()) {
    await addHeroBtn.click();
    await page.waitForTimeout(300);
  }

  const comboboxInput = page.locator('.cb-input').first();
  const exists = await comboboxInput.count();
  console.log('Combobox inputs found:', exists);
  if (exists > 0) {
    const box = await comboboxInput.boundingBox();
    console.log('Combobox bounding box:', JSON.stringify(box));
    await comboboxInput.click();
    await page.waitForTimeout(300);
    const openAttr = await comboboxInput.getAttribute('aria-expanded');
    console.log('aria-expanded after click:', openAttr);
    const listCount = await page.locator('.cb-list').count();
    console.log('cb-list elements in DOM:', listCount);
    if (listCount > 0) {
      const listBox = await page.locator('.cb-list').first().boundingBox();
      console.log('cb-list bounding box:', JSON.stringify(listBox));
    }
    await page.screenshot({ path: 'test-after-click.png' });
  }
} else {
  console.log('No campaigns found');
  await page.screenshot({ path: 'test-empty.png' });
}

await browser.close();
