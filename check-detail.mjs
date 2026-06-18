import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:5173/campaigns');
await page.fill('input#campaign-name', 'Test Run');
await page.click('button[type=submit]');
await page.waitForURL(/campaigns\/.+/, { timeout: 5000 });
console.log('URL:', page.url());
await page.screenshot({ path: 'C:/Users/amaus/AppData/Local/Temp/detail.png', fullPage: true });
await browser.close();
