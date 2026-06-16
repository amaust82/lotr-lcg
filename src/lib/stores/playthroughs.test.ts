// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
});

describe('playthroughs store', () => {
	it('initializes with an empty array when localStorage is empty', async () => {
		const { playthroughs } = await import('./playthroughs');
		expect(get(playthroughs)).toEqual([]);
	});

	it('createPlaythrough adds to store and persists to localStorage', async () => {
		const { playthroughs } = await import('./playthroughs');
		const p = { id: 'p1', name: 'Run 1', productId: 'prod-a', decks: [], scenarios: [], createdAt: '2026-01-01' };
		playthroughs.createPlaythrough(p);
		expect(get(playthroughs)).toHaveLength(1);
		expect(get(playthroughs)[0].id).toBe('p1');
		const saved = JSON.parse(localStorage.getItem('lotr-lcg:playthroughs')!);
		expect(saved[0].id).toBe('p1');
	});

	it('updatePlaythrough reflects change in store and localStorage', async () => {
		const { playthroughs } = await import('./playthroughs');
		const p = { id: 'p1', name: 'Run 1', productId: 'prod-a', decks: [], scenarios: [], createdAt: '2026-01-01' };
		playthroughs.createPlaythrough(p);
		playthroughs.updatePlaythrough('p1', { name: 'Run 1 Updated' });
		expect(get(playthroughs)[0].name).toBe('Run 1 Updated');
		const saved = JSON.parse(localStorage.getItem('lotr-lcg:playthroughs')!);
		expect(saved[0].name).toBe('Run 1 Updated');
	});

	it('deletePlaythrough removes from store and localStorage', async () => {
		const { playthroughs } = await import('./playthroughs');
		const p = { id: 'p1', name: 'Run 1', productId: 'prod-a', decks: [], scenarios: [], createdAt: '2026-01-01' };
		playthroughs.createPlaythrough(p);
		playthroughs.deletePlaythrough('p1');
		expect(get(playthroughs)).toHaveLength(0);
		const saved = JSON.parse(localStorage.getItem('lotr-lcg:playthroughs')!);
		expect(saved).toHaveLength(0);
	});

	it('updating one playthrough does not affect others', async () => {
		const { playthroughs } = await import('./playthroughs');
		const p1 = { id: 'p1', name: 'Run 1', productId: 'prod-a', decks: [], scenarios: [], createdAt: '2026-01-01' };
		const p2 = { id: 'p2', name: 'Run 2', productId: 'prod-b', decks: [], scenarios: [], createdAt: '2026-01-02' };
		playthroughs.createPlaythrough(p1);
		playthroughs.createPlaythrough(p2);
		playthroughs.updatePlaythrough('p1', { name: 'Run 1 Renamed' });
		const state = get(playthroughs);
		expect(state.find((p) => p.id === 'p2')!.name).toBe('Run 2');
	});

	it('rehydrates from localStorage on init', async () => {
		const existing = [
			{ id: 'p1', name: 'Saved Run', productId: 'prod-a', decks: [], scenarios: [], createdAt: '2026-01-01' }
		];
		localStorage.setItem('lotr-lcg:playthroughs', JSON.stringify(existing));
		const { playthroughs } = await import('./playthroughs');
		const state = get(playthroughs);
		expect(state).toHaveLength(1);
		expect(state[0].name).toBe('Saved Run');
	});

	it('falls back to empty array on corrupt localStorage', async () => {
		localStorage.setItem('lotr-lcg:playthroughs', 'not-json');
		const { playthroughs } = await import('./playthroughs');
		expect(get(playthroughs)).toEqual([]);
	});
});

describe('playthroughs store — deck management', () => {
	const BASE_PT = { id: 'pt1', name: 'Run 1', productId: 'prod-a', decks: [], scenarios: [], createdAt: '2026-01-01' };
	const DECK = { id: 'd1', label: 'Aragorn deck', heroSlots: [] };

	it('addDeck appends a deck and persists to localStorage', async () => {
		const { playthroughs } = await import('./playthroughs');
		playthroughs.createPlaythrough(BASE_PT);
		playthroughs.addDeck('pt1', DECK);
		const state = get(playthroughs);
		expect(state[0].decks).toHaveLength(1);
		expect(state[0].decks[0].id).toBe('d1');
		const saved = JSON.parse(localStorage.getItem('lotr-lcg:playthroughs')!);
		expect(saved[0].decks[0].id).toBe('d1');
	});

	it('removeDeck removes the correct deck and leaves others intact', async () => {
		const { playthroughs } = await import('./playthroughs');
		playthroughs.createPlaythrough(BASE_PT);
		playthroughs.addDeck('pt1', DECK);
		playthroughs.addDeck('pt1', { id: 'd2', label: 'Legolas deck', heroSlots: [] });
		playthroughs.removeDeck('pt1', 'd1');
		const state = get(playthroughs);
		expect(state[0].decks).toHaveLength(1);
		expect(state[0].decks[0].id).toBe('d2');
	});

	it('addHeroSlot appends to the correct deck', async () => {
		const { playthroughs } = await import('./playthroughs');
		playthroughs.createPlaythrough(BASE_PT);
		playthroughs.addDeck('pt1', DECK);
		const heroSlot = { heroName: 'Aragorn', boons: [], burdens: [], fallen: false };
		playthroughs.addHeroSlot('pt1', 'd1', heroSlot);
		const state = get(playthroughs);
		expect(state[0].decks[0].heroSlots).toHaveLength(1);
		expect(state[0].decks[0].heroSlots[0].heroName).toBe('Aragorn');
	});

	it('removeHeroSlot removes by index', async () => {
		const { playthroughs } = await import('./playthroughs');
		playthroughs.createPlaythrough(BASE_PT);
		playthroughs.addDeck('pt1', DECK);
		playthroughs.addHeroSlot('pt1', 'd1', { heroName: 'Aragorn', boons: [], burdens: [], fallen: false });
		playthroughs.addHeroSlot('pt1', 'd1', { heroName: 'Legolas', boons: [], burdens: [], fallen: false });
		playthroughs.removeHeroSlot('pt1', 'd1', 0);
		const state = get(playthroughs);
		expect(state[0].decks[0].heroSlots).toHaveLength(1);
		expect(state[0].decks[0].heroSlots[0].heroName).toBe('Legolas');
	});

	it('updateHeroSlot - fallen flag persists to localStorage', async () => {
		const { playthroughs } = await import('./playthroughs');
		playthroughs.createPlaythrough(BASE_PT);
		playthroughs.addDeck('pt1', DECK);
		playthroughs.addHeroSlot('pt1', 'd1', { heroName: 'Aragorn', boons: [], burdens: [], fallen: false });
		playthroughs.updateHeroSlot('pt1', 'd1', 0, { fallen: true });
		const state = get(playthroughs);
		expect(state[0].decks[0].heroSlots[0].fallen).toBe(true);
		const saved = JSON.parse(localStorage.getItem('lotr-lcg:playthroughs')!);
		expect(saved[0].decks[0].heroSlots[0].fallen).toBe(true);
	});
});
