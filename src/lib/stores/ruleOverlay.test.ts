// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import type { RuleEntry } from '$lib/data/rules';

const surge: RuleEntry = {
	name: 'Surge',
	type: 'keyword',
	product: 'revised-core-set',
	ref: '1.38',
	summary: 'Reveal one additional encounter card.',
	related: ['Doomed X'],
};

const doomed: RuleEntry = {
	name: 'Doomed X',
	type: 'keyword',
	product: 'revised-core-set',
	ref: '1.19',
	summary: 'Each player raises their threat by X.',
	related: ['Surge'],
};

beforeEach(async () => {
	const mod = await import('./ruleOverlay');
	mod.ruleOverlay.close();
});

describe('ruleOverlay store', () => {
	it('defaults to closed', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		const state = get(ruleOverlay);
		expect(state.isOpen).toBe(false);
	});

	it('close() collapses to closed', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		ruleOverlay.open(surge);
		ruleOverlay.close();
		expect(get(ruleOverlay).isOpen).toBe(false);
	});

	it('navigate(entry) pushes current entry to back stack and shows new entry', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		ruleOverlay.open(surge);
		ruleOverlay.navigate(doomed);
		const state = get(ruleOverlay);
		if (state.isOpen && state.mode === 'detail') {
			expect(state.entry).toBe(doomed);
			expect(state.backStack).toHaveLength(1);
			expect(state.backStack[0]).toBe(surge);
		} else {
			throw new Error('expected detail mode');
		}
	});

	it('back() pops the stack and restores the previous entry', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		ruleOverlay.open(surge);
		ruleOverlay.navigate(doomed);
		ruleOverlay.back();
		const state = get(ruleOverlay);
		if (state.isOpen && state.mode === 'detail') {
			expect(state.entry).toBe(surge);
			expect(state.backStack).toHaveLength(0);
		} else {
			throw new Error('expected detail mode');
		}
	});

	it('back() when stack is empty does not crash or change state', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		ruleOverlay.open(surge);
		ruleOverlay.back();
		const state = get(ruleOverlay);
		if (state.isOpen && state.mode === 'detail') {
			expect(state.entry).toBe(surge);
		} else {
			throw new Error('expected detail mode');
		}
	});

	it('openSearch() opens in search mode', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		ruleOverlay.openSearch();
		const state = get(ruleOverlay);
		expect(state.isOpen).toBe(true);
		if (state.isOpen) {
			expect(state.mode).toBe('search');
		}
	});

	it('open(entry) opens in detail mode with that entry', async () => {
		const { ruleOverlay } = await import('./ruleOverlay');
		ruleOverlay.open(surge);
		const state = get(ruleOverlay);
		expect(state.isOpen).toBe(true);
		if (state.isOpen && state.mode === 'detail') {
			expect(state.entry).toBe(surge);
			expect(state.mode).toBe('detail');
			expect(state.backStack).toHaveLength(0);
		} else {
			throw new Error('expected detail mode');
		}
	});
});
