// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
});

describe('collection store', () => {
	it('defaults to Revised Core Set owned, showEverything false', async () => {
		const { collection } = await import('./collection');
		const state = get(collection);
		expect(state.products['revised-core-set']).toBe(true);
		expect(state.showEverything).toBe(false);
	});

	it('setOwned enables a non-locked product', async () => {
		const { collection } = await import('./collection');
		collection.setOwned('angmar-awakened', true);
		expect(get(collection).products['angmar-awakened']).toBe(true);
	});

	it('setOwned cannot disable the Revised Core Set', async () => {
		const { collection } = await import('./collection');
		collection.setOwned('revised-core-set', false);
		expect(get(collection).products['revised-core-set']).toBe(true);
	});

	it('setShowEverything updates the flag', async () => {
		const { collection } = await import('./collection');
		collection.setShowEverything(true);
		expect(get(collection).showEverything).toBe(true);
		collection.setShowEverything(false);
		expect(get(collection).showEverything).toBe(false);
	});

	it('changes write to localStorage immediately', async () => {
		const { collection } = await import('./collection');
		collection.setOwned('angmar-awakened', true);
		const saved = JSON.parse(localStorage.getItem('lotr-lcg:collection')!);
		expect(saved.products['angmar-awakened']).toBe(true);
	});

	it('rehydrates state from localStorage on startup', async () => {
		localStorage.setItem(
			'lotr-lcg:collection',
			JSON.stringify({ products: { 'revised-core-set': true, 'angmar-awakened': true }, showEverything: true })
		);
		const { collection } = await import('./collection');
		const state = get(collection);
		expect(state.products['angmar-awakened']).toBe(true);
		expect(state.showEverything).toBe(true);
	});

	it('falls back to defaults when localStorage is empty', async () => {
		const { collection } = await import('./collection');
		const state = get(collection);
		expect(state.products['revised-core-set']).toBe(true);
		expect(state.showEverything).toBe(false);
	});

	it('falls back to defaults when localStorage contains corrupt JSON', async () => {
		localStorage.setItem('lotr-lcg:collection', 'not-json');
		const { collection } = await import('./collection');
		const state = get(collection);
		expect(state.products['revised-core-set']).toBe(true);
		expect(state.showEverything).toBe(false);
	});

	it('Revised Core Set is always true even when localStorage says false', async () => {
		localStorage.setItem(
			'lotr-lcg:collection',
			JSON.stringify({ products: { 'revised-core-set': false }, showEverything: false })
		);
		const { collection } = await import('./collection');
		expect(get(collection).products['revised-core-set']).toBe(true);
	});
});
