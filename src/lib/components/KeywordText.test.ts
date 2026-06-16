// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { get } from 'svelte/store';

beforeEach(async () => {
	const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
	const { collection } = await import('$lib/stores/collection');
	ruleOverlay.close();
	collection.setShowEverything(false);
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

	it('keyword from a non-owned product renders as plain text, not a button', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const rulesModule = await import('$lib/data/rules');
		const unownedEntry = {
			name: 'Warg Rider',
			type: 'keyword' as const,
			product: 'angmar-awakened-hero',
			ref: '2.01',
			summary: 'A warg keyword.',
			related: [],
		};
		rulesModule.rules.push(unownedEntry);

		const { container, queryAllByRole } = render(KeywordText, { text: '[[Warg Rider]]' });
		expect(container.textContent).toContain('Warg Rider');
		expect(queryAllByRole('button')).toHaveLength(0);

		rulesModule.rules.pop();
	});

	it('keyword from a non-owned product renders as a button when showEverything is true', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const { collection } = await import('$lib/stores/collection');
		const rulesModule = await import('$lib/data/rules');
		const unownedEntry = {
			name: 'Warg Rider',
			type: 'keyword' as const,
			product: 'angmar-awakened-hero',
			ref: '2.01',
			summary: 'A warg keyword.',
			related: [],
		};
		rulesModule.rules.push(unownedEntry);
		collection.setShowEverything(true);

		const { getByRole } = render(KeywordText, { text: '[[Warg Rider]]' });
		expect(getByRole('button', { name: 'Warg Rider' })).toBeTruthy();

		rulesModule.rules.pop();
	});

	it('keyword from an owned product still renders as a button', async () => {
		const KeywordText = (await import('./KeywordText.svelte')).default;
		const { getByRole } = render(KeywordText, { text: '[[Surge]]' });
		expect(getByRole('button', { name: 'Surge' })).toBeTruthy();
	});
});
