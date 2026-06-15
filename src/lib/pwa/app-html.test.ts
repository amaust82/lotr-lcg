import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const appHtml = readFileSync(resolve('src/app.html'), 'utf-8');

describe('app.html PWA wiring', () => {
	it('links to the web manifest', () => {
		expect(appHtml).toContain('rel="manifest"');
	});
});
