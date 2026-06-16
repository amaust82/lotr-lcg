import { writable } from 'svelte/store';

export type ViewMode = 'guided' | 'reference';

const KEY = 'lotr-lcg:viewMode';

function createViewModeStore() {
	const initial: ViewMode =
		typeof localStorage !== 'undefined'
			? ((localStorage.getItem(KEY) as ViewMode) ?? 'guided')
			: 'guided';

	const { subscribe, set, update } = writable<ViewMode>(initial);

	return {
		subscribe,
		toggle() {
			update((m) => {
				const next: ViewMode = m === 'guided' ? 'reference' : 'guided';
				if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, next);
				return next;
			});
		},
		set(mode: ViewMode) {
			if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, mode);
			set(mode);
		},
	};
}

export const viewMode = createViewModeStore();
