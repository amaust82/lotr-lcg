// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { get } from 'svelte/store';

beforeEach(async () => {
	const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
	ruleOverlay.close();
});

afterEach(() => {
	cleanup();
});

describe('KeywordText component', () => {
	it('renders plain text without any buttons', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const { container, queryAllByRole } = render(KeywordText, { text: 'Reveal one card.' });
		expect(container.textContent).toBe('Reveal one card.');
		expect(queryAllByRole('button')).toHaveLength(0);
	});

	it('renders a recognised keyword as a button', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const { getByRole } = render(KeywordText, { text: 'A card with [[Surge]] effect.' });
		expect(getByRole('button', { name: 'Surge' })).toBeTruthy();
	});

	it('unrecognised [[Unknown]] token degrades to plain text, no button', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const { container, queryAllByRole } = render(KeywordText, { text: 'See [[UnknownKeyword]] for details.' });
		expect(container.textContent).toContain('UnknownKeyword');
		expect(queryAllByRole('button')).toHaveLength(0);
	});

	it('clicking a recognised keyword opens the ruleOverlay with the matching entry', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const { getByRole } = render(KeywordText, { text: '[[Surge]]' });
		await fireEvent.click(getByRole('button', { name: 'Surge' }));
		const state = get(ruleOverlay);
		expect(state.isOpen).toBe(true);
		if (state.isOpen && state.mode === 'detail') {
			expect(state.entry.name).toBe('Surge');
		} else {
			throw new Error('expected detail mode');
		}
	});
});
