// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
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

const surgeWithFull: RuleEntry = {
	...surge,
	full: 'When a card with Surge is revealed from the encounter deck, the first player immediately reveals one additional encounter card from the top of the encounter deck.',
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
	const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
	const { collection } = await import('$lib/stores/collection');
	ruleOverlay.close();
	collection.setShowEverything(false);
});

afterEach(() => {
	cleanup();
});

describe('RuleOverlay component', () => {
	it('renders nothing when the overlay is closed', async () => {
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		const { container } = render(RuleOverlay);
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	it('no expand control when full is absent', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surge);
		const { queryByRole } = render(RuleOverlay);
		expect(queryByRole('button', { name: /expand|more|full/i })).toBeNull();
	});

	it('expand control appears and reveals full text when clicked', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surgeWithFull);
		const { getByRole, queryByText, getByText } = render(RuleOverlay);
		expect(queryByText(surgeWithFull.full!)).toBeNull();
		await fireEvent.click(getByRole('button', { name: /expand|more|full/i }));
		expect(getByText(surgeWithFull.full!)).toBeTruthy();
	});

	it('related entries render as buttons', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surge);
		const { getByRole } = render(RuleOverlay);
		expect(getByRole('button', { name: 'Doomed X' })).toBeTruthy();
	});

	it('back button absent when back stack is empty', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surge);
		const { queryByRole } = render(RuleOverlay);
		expect(queryByRole('button', { name: /back/i })).toBeNull();
	});

	it('back button present when back stack has entries', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surge);
		ruleOverlay.navigate(doomed);
		const { getByRole } = render(RuleOverlay);
		expect(getByRole('button', { name: /back/i })).toBeTruthy();
	});

	it('search input is present in search mode', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.openSearch();
		const { getByRole } = render(RuleOverlay);
		expect(getByRole('searchbox')).toBeTruthy();
	});

	it('typing in search input filters rule entries by name', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.openSearch();
		const { getByRole, getByText, queryByText } = render(RuleOverlay);
		await fireEvent.input(getByRole('searchbox'), { target: { value: 'Surge' } });
		expect(getByText('Surge')).toBeTruthy();
		expect(queryByText('Sentinel')).toBeNull();
	});

	it('Escape key closes the overlay', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surge);
		const { getByRole } = render(RuleOverlay);
		expect(getByRole('dialog')).toBeTruthy();
		await fireEvent.keyDown(document, { key: 'Escape' });
		const { ruleOverlay: store } = await import('$lib/stores/ruleOverlay');
		expect(get(store).isOpen).toBe(false);
	});

	it('renders name, ref, summary, and type when opened with an entry', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		ruleOverlay.open(surge);
		const { getByRole, getByText } = render(RuleOverlay);
		expect(getByRole('dialog')).toBeTruthy();
		expect(getByText('Surge')).toBeTruthy();
		expect(getByText('1.38')).toBeTruthy();
		expect(getByText('Reveal one additional encounter card.')).toBeTruthy();
		expect(getByText('keyword')).toBeTruthy();
	});

	it('search results are filtered to owned products by default', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const { collection } = await import('$lib/stores/collection');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		// 'angmar-awakened-hero' is not owned by default
		const unownedEntry: RuleEntry = {
			name: 'Warg',
			type: 'keyword',
			product: 'angmar-awakened-hero',
			ref: '2.01',
			summary: 'A fearsome creature keyword.',
			related: [],
		};
		// Patch rules to include the unowned entry
		const rulesModule = await import('$lib/data/rules');
		rulesModule.rules.push(unownedEntry);

		ruleOverlay.openSearch();
		const { getByRole, queryByText } = render(RuleOverlay);
		await fireEvent.input(getByRole('searchbox'), { target: { value: 'Warg' } });
		expect(queryByText('Warg')).toBeNull();

		// Cleanup
		rulesModule.rules.pop();
	});

	it('search results show all entries when showEverything is true', async () => {
		const { ruleOverlay } = await import('$lib/stores/ruleOverlay');
		const { collection } = await import('$lib/stores/collection');
		const RuleOverlay = (await import('./RuleOverlay.svelte')).default;
		const unownedEntry: RuleEntry = {
			name: 'Warg',
			type: 'keyword',
			product: 'angmar-awakened-hero',
			ref: '2.01',
			summary: 'A fearsome creature keyword.',
			related: [],
		};
		const rulesModule = await import('$lib/data/rules');
		rulesModule.rules.push(unownedEntry);
		collection.setShowEverything(true);

		ruleOverlay.openSearch();
		const { getByRole, getByText } = render(RuleOverlay);
		await fireEvent.input(getByRole('searchbox'), { target: { value: 'Warg' } });
		expect(getByText('Warg')).toBeTruthy();

		// Cleanup
		rulesModule.rules.pop();
	});
});
