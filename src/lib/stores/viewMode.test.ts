// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
});

describe('viewMode store', () => {
	it('defaults to guided when localStorage is empty', async () => {
		const { viewMode } = await import('./viewMode');
		expect(get(viewMode)).toBe('guided');
	});

	it('toggle switches guided → reference', async () => {
		const { viewMode } = await import('./viewMode');
		viewMode.toggle();
		expect(get(viewMode)).toBe('reference');
	});

	it('toggle switches reference → guided', async () => {
		const { viewMode } = await import('./viewMode');
		viewMode.toggle();
		viewMode.toggle();
		expect(get(viewMode)).toBe('guided');
	});

	it('toggle persists the new value to localStorage', async () => {
		const { viewMode } = await import('./viewMode');
		viewMode.toggle();
		expect(localStorage.getItem('lotr-lcg:viewMode')).toBe('reference');
	});

	it('reads from localStorage on init', async () => {
		localStorage.setItem('lotr-lcg:viewMode', 'reference');
		const { viewMode } = await import('./viewMode');
		expect(get(viewMode)).toBe('reference');
	});
});
