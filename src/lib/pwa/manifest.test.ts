import { describe, it, expect } from 'vitest';
import { manifest } from './manifest';

describe('PWA manifest', () => {
	it('has name and short_name', () => {
		expect(manifest.name).toBeTruthy();
		expect(manifest.short_name).toBeTruthy();
	});

	it('has canvas theme and background color', () => {
		expect(manifest.theme_color).toBe('#201d18');
		expect(manifest.background_color).toBe('#201d18');
	});

	it('has standalone display mode', () => {
		expect(manifest.display).toBe('standalone');
	});

	it('has 192px and 512px icon entries', () => {
		const sizes = manifest.icons.map((i) => i.sizes);
		expect(sizes).toContain('192x192');
		expect(sizes).toContain('512x512');
	});

	it('has a maskable icon entry', () => {
		const maskable = manifest.icons.find((i) => i.purpose === 'maskable');
		expect(maskable).toBeDefined();
	});
});
