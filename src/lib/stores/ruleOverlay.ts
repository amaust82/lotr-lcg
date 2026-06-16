import { writable, get } from 'svelte/store';
import type { RuleEntry } from '$lib/data/rules';

export type OverlayState =
	| { isOpen: false }
	| { isOpen: true; mode: 'detail'; entry: RuleEntry; backStack: RuleEntry[] }
	| { isOpen: true; mode: 'search' };

function createRuleOverlay() {
	const { subscribe, set } = writable<OverlayState>({ isOpen: false });

	return {
		subscribe,
		open(entry: RuleEntry) {
			set({ isOpen: true, mode: 'detail', entry, backStack: [] });
		},
		openSearch() {
			set({ isOpen: true, mode: 'search' });
		},
		close() {
			set({ isOpen: false });
		},
		navigate(entry: RuleEntry) {
			const current = get({ subscribe });
			if (current.isOpen && current.mode === 'detail') {
				set({ isOpen: true, mode: 'detail', entry, backStack: [...current.backStack, current.entry] });
			}
		},
		back() {
			const current = get({ subscribe });
			if (current.isOpen && current.mode === 'detail' && current.backStack.length > 0) {
				const stack = [...current.backStack];
				const entry = stack.pop()!;
				set({ isOpen: true, mode: 'detail', entry, backStack: stack });
			}
		},
	};
}

export const ruleOverlay = createRuleOverlay();
