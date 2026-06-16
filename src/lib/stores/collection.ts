import { writable } from 'svelte/store';
import { REVISED_CORE_SET } from '$lib/data/rules';

export type CollectionState = {
	products: Record<string, boolean>;
	showEverything: boolean;
};

const KEY = 'lotr-lcg:collection';

const DEFAULTS: CollectionState = {
	products: { [REVISED_CORE_SET.id]: true },
	showEverything: false,
};

function load(): CollectionState {
	if (typeof localStorage === 'undefined') return DEFAULTS;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULTS;
		const parsed = JSON.parse(raw) as CollectionState;
		return { ...DEFAULTS, ...parsed, products: { ...parsed.products, [REVISED_CORE_SET.id]: true } };
	} catch {
		return DEFAULTS;
	}
}

function createCollectionStore() {
	const { subscribe, set, update } = writable<CollectionState>(load());

	function persist(state: CollectionState) {
		if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
		return state;
	}

	return {
		subscribe,
		setOwned(productId: string, owned: boolean) {
			if (productId === REVISED_CORE_SET.id) return;
			update((s) => persist({ ...s, products: { ...s.products, [productId]: owned } }));
		},
		setShowEverything(value: boolean) {
			update((s) => persist({ ...s, showEverything: value }));
		},
	};
}

export const collection = createCollectionStore();
