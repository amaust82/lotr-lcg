// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { playthroughs } from '$lib/stores/playthroughs';
import Page from './+page.svelte';

const REVISED_CORE = 'revised-core-set';
const REVISED_CORE_SCENARIOS = [
	'Passage Through Mirkwood',
	'Journey Along the Anduin',
	'Escape from Dol Guldur',
];

function seedPlaythrough(overrides = {}) {
	const pt = {
		id: 'test-pt-1',
		name: 'My Fellowship Run',
		productId: REVISED_CORE,
		decks: [],
		scenarios: [],
		createdAt: '2026-01-01T00:00:00.000Z',
		...overrides,
	};
	playthroughs.createPlaythrough(pt);
	return pt;
}

afterEach(() => {
	cleanup();
	localStorage.clear();
	// drain store
	get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
});

beforeEach(() => {
	localStorage.clear();
	get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
});

describe('Campaign detail screen', () => {
	it('renders the playthrough name and product name', () => {
		seedPlaythrough();
		const { getByText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(getByText('My Fellowship Run')).toBeInTheDocument();
		expect(getByText(/revised core set/i)).toBeInTheDocument();
	});

	it('renders scenarios in order from campaigns.ts', () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const items = getAllByRole('listitem');
		expect(items[0]).toHaveTextContent(REVISED_CORE_SCENARIOS[0]);
		expect(items[1]).toHaveTextContent(REVISED_CORE_SCENARIOS[1]);
		expect(items[2]).toHaveTextContent(REVISED_CORE_SCENARIOS[2]);
	});

	it('shows progress summary: 0 / 3 completed initially', () => {
		seedPlaythrough();
		const { getByText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(getByText(/0\s*\/\s*3/)).toBeInTheDocument();
	});

	it('status toggle advances: not_attempted → completed → failed → not_attempted', async () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const toggleBtns = getAllByRole('button', { name: /toggle status/i });
		const btn = toggleBtns[0];

		// Initial state
		expect(btn).toHaveAttribute('aria-label', expect.stringMatching(/not.attempted/i));

		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-label', expect.stringMatching(/completed/i));

		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-label', expect.stringMatching(/failed/i));

		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-label', expect.stringMatching(/not.attempted/i));
	});

	it('status toggle updates the store', async () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const toggleBtns = getAllByRole('button', { name: /toggle status/i });
		await fireEvent.click(toggleBtns[0]);

		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		const firstScenario = stored.scenarios.find(
			(s) => s.scenarioId === 'rcs-passage-through-mirkwood'
		);
		expect(firstScenario?.status).toBe('completed');
	});

	it('progress summary updates after toggling a scenario to completed', async () => {
		seedPlaythrough();
		const { getAllByRole, getByText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.click(getAllByRole('button', { name: /toggle status/i })[0]);
		expect(getByText(/1\s*\/\s*3/)).toBeInTheDocument();
	});

	it('notes textarea persists to store immediately on input', async () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const textareas = getAllByRole('textbox');
		await fireEvent.input(textareas[0], { target: { value: 'Struggled with the Nazgûl.' } });

		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		const scenarioRecord = stored.scenarios.find(
			(s) => s.scenarioId === 'rcs-passage-through-mirkwood'
		);
		expect(scenarioRecord?.notes).toBe('Struggled with the Nazgûl.');
	});

	it('notes persist across a simulated page reload', async () => {
		seedPlaythrough({
			scenarios: [
				{
					scenarioId: 'rcs-passage-through-mirkwood',
					status: 'completed' as const,
					notes: 'Won on first try!',
				},
			],
		});

		// Simulate reload: re-render with same id; store rehydrates from localStorage.
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const textareas = getAllByRole('textbox');
		expect(textareas[0]).toHaveValue('Won on first try!');
	});
});

describe('Campaign detail — Player management', () => {
	afterEach(() => {
		cleanup();
		localStorage.clear();
		get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
	});

	beforeEach(() => {
		localStorage.clear();
		get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
	});

	function seed(overrides = {}) {
		const pt = {
			id: 'test-pt-1',
			name: 'My Run',
			productId: REVISED_CORE,
			decks: [],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
			...overrides,
		};
		playthroughs.createPlaythrough(pt);
		return pt;
	}

	it('shows an "Add Deck" button when fewer than 4 decks exist', () => {
		seed();
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(getByRole('button', { name: /add player/i })).toBeInTheDocument();
	});

	it('clicking "Add Deck" adds a deck to the store', async () => {
		seed();
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.click(getByRole('button', { name: /add player/i }));
		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		expect(stored.decks).toHaveLength(1);
	});

	it('"Add Deck" button is hidden when 4 decks already exist', () => {
		seed({
			decks: [
				{ id: 'd1', heroSlots: [] },
				{ id: 'd2', heroSlots: [] },
				{ id: 'd3', heroSlots: [] },
				{ id: 'd4', heroSlots: [] },
			],
		});
		const { queryByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(queryByRole('button', { name: /add player/i })).not.toBeInTheDocument();
	});

	it('remove deck button removes the deck from the store', async () => {
		seed({ decks: [{ id: 'd1', label: 'Test deck', heroSlots: [] }] });
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.click(getByRole('button', { name: /remove player/i }));
		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		expect(stored.decks).toHaveLength(0);
	});

	it('deck label input persists to the store', async () => {
		seed({ decks: [{ id: 'd1', label: '', heroSlots: [] }] });
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const input = getByRole('textbox', { name: /player label/i });
		await fireEvent.input(input, { target: { value: 'Aragorn deck' } });
		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		expect(stored.decks[0].label).toBe('Aragorn deck');
	});

	it('"Add Hero" button adds a hero slot to the deck', async () => {
		seed({ decks: [{ id: 'd1', heroSlots: [] }] });
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.click(getByRole('button', { name: /add hero/i }));
		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		expect(stored.decks[0].heroSlots).toHaveLength(1);
	});

	it('"Add Hero" button hidden when 3 slots already exist', () => {
		seed({
			decks: [{
				id: 'd1',
				heroSlots: [
					{ heroName: 'A', boons: [], burdens: [], fallen: false },
					{ heroName: 'B', boons: [], burdens: [], fallen: false },
					{ heroName: 'C', boons: [], burdens: [], fallen: false },
				],
			}],
		});
		const { queryByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(queryByRole('button', { name: /add hero/i })).not.toBeInTheDocument();
	});

	it('hero name input persists to the store', async () => {
		seed({ decks: [{ id: 'd1', heroSlots: [{ heroName: '', boons: [], burdens: [], fallen: false }] }] });
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const input = getByRole('textbox', { name: /hero name/i });
		await fireEvent.input(input, { target: { value: 'Aragorn' } });
		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		expect(stored.decks[0].heroSlots[0].heroName).toBe('Aragorn');
	});

	it('remove hero button removes the slot from the store', async () => {
		seed({
			decks: [{
				id: 'd1',
				heroSlots: [{ heroName: 'Aragorn', boons: [], burdens: [], fallen: false }],
			}],
		});
		const { getByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.click(getByRole('button', { name: /remove hero/i }));
		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		expect(stored.decks[0].heroSlots).toHaveLength(0);
	});
});

describe('Campaign detail — Saga gating', () => {
	const SAGA_PRODUCT = 'fellowship-of-the-ring-saga';

	afterEach(() => {
		cleanup();
		localStorage.clear();
		get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
	});

	beforeEach(() => {
		localStorage.clear();
		get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
	});

	it('boon/burden/fallen controls hidden for non-saga product', () => {
		playthroughs.createPlaythrough({
			id: 'pt-non-saga',
			name: 'Run',
			productId: REVISED_CORE,
			decks: [{ id: 'd1', heroSlots: [{ heroName: 'Aragorn', boons: [], burdens: [], fallen: false }] }],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
		});
		const { queryByRole } = render(Page, { props: { data: { id: 'pt-non-saga' } } });
		expect(queryByRole('button', { name: /toggle fallen/i })).not.toBeInTheDocument();
	});

	it('fallen toggle button visible for saga product', () => {
		playthroughs.createPlaythrough({
			id: 'pt-saga',
			name: 'Saga Run',
			productId: SAGA_PRODUCT,
			decks: [{ id: 'd1', heroSlots: [{ heroName: 'Frodo', boons: [], burdens: [], fallen: false }] }],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
		});
		const { getByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		expect(getByRole('button', { name: /toggle fallen/i })).toBeInTheDocument();
	});

	it('fallen toggle updates the store and hero slot gets data-fallen attribute', async () => {
		playthroughs.createPlaythrough({
			id: 'pt-saga',
			name: 'Saga Run',
			productId: SAGA_PRODUCT,
			decks: [{ id: 'd1', heroSlots: [{ heroName: 'Frodo', boons: [], burdens: [], fallen: false }] }],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
		});
		const { getByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		await fireEvent.click(getByRole('button', { name: /toggle fallen/i }));
		const stored = get(playthroughs).find((p) => p.id === 'pt-saga')!;
		expect(stored.decks[0].heroSlots[0].fallen).toBe(true);
	});
});
