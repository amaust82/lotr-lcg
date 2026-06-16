// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';

afterEach(() => {
	cleanup();
});

describe('SearchTrigger component', () => {
	it('renders a button with aria-label "Search"', async () => {
		const SearchTrigger = (await import('./SearchTrigger.svelte')).default;
		const { getByRole } = render(SearchTrigger);
		expect(getByRole('button', { name: /search/i })).toBeTruthy();
	});

	it('clicking opens the rule overlay in search mode', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const openSearch = vi.spyOn(ruleOverlay, 'openSearch');
		const SearchTrigger = (await import('./SearchTrigger.svelte')).default;
		const { getByRole } = render(SearchTrigger);
		await fireEvent.click(getByRole('button', { name: /search/i }));
		expect(openSearch).toHaveBeenCalledOnce();
	});
});
