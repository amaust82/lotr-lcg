import { writable } from 'svelte/store';
import type { Deck, HeroSlot, Playthrough } from '$lib/types/playthrough';

const KEY = 'lotr-lcg:playthroughs';

function load(): Playthrough[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		return JSON.parse(raw) as Playthrough[];
	} catch {
		return [];
	}
}

function createPlaythroughsStore() {
	const { subscribe, update } = writable<Playthrough[]>(load());

	function persist(state: Playthrough[]) {
		if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
		return state;
	}

	return {
		subscribe,
		createPlaythrough(p: Playthrough) {
			update((s) => persist([...s, p]));
		},
		updatePlaythrough(id: string, changes: Partial<Omit<Playthrough, 'id' | 'createdAt'>>) {
			update((s) => persist(s.map((p) => (p.id === id ? { ...p, ...changes } : p))));
		},
		deletePlaythrough(id: string) {
			update((s) => persist(s.filter((p) => p.id !== id)));
		},
		addDeck(playthroughId: string, deck: Deck) {
			update((s) =>
				persist(
					s.map((p) =>
						p.id === playthroughId ? { ...p, decks: [...p.decks, deck] } : p
					)
				)
			);
		},
		removeDeck(playthroughId: string, deckId: string) {
			update((s) =>
				persist(
					s.map((p) =>
						p.id === playthroughId ? { ...p, decks: p.decks.filter((d) => d.id !== deckId) } : p
					)
				)
			);
		},
		addHeroSlot(playthroughId: string, deckId: string, heroSlot: HeroSlot) {
			update((s) =>
				persist(
					s.map((p) =>
						p.id === playthroughId
							? {
									...p,
									decks: p.decks.map((d) =>
										d.id === deckId ? { ...d, heroSlots: [...d.heroSlots, heroSlot] } : d
									),
								}
							: p
					)
				)
			);
		},
		removeHeroSlot(playthroughId: string, deckId: string, slotIndex: number) {
			update((s) =>
				persist(
					s.map((p) =>
						p.id === playthroughId
							? {
									...p,
									decks: p.decks.map((d) =>
										d.id === deckId
											? { ...d, heroSlots: d.heroSlots.filter((_, i) => i !== slotIndex) }
											: d
									),
								}
							: p
					)
				)
			);
		},
		updateHeroSlot(
			playthroughId: string,
			deckId: string,
			slotIndex: number,
			changes: Partial<HeroSlot>
		) {
			update((s) =>
				persist(
					s.map((p) =>
						p.id === playthroughId
							? {
									...p,
									decks: p.decks.map((d) =>
										d.id === deckId
											? {
													...d,
													heroSlots: d.heroSlots.map((h, i) =>
														i === slotIndex ? { ...h, ...changes } : h
													),
												}
											: d
									),
								}
							: p
					)
				)
			);
		},
	};
}

export const playthroughs = createPlaythroughsStore();
