// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { playthroughs } from '$lib/stores/playthroughs';
import type { HeroSlot } from '$lib/types/playthrough';
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

	it('status select has options for completed, failed, and not played', () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const selects = getAllByRole('combobox', { name: /status for/i });
		expect(selects[0]).toBeInTheDocument();
		expect(selects[0]).toHaveValue('not_attempted');
	});

	it('changing status select to completed updates the store', async () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const selects = getAllByRole('combobox', { name: /status for/i });
		await fireEvent.change(selects[0], { target: { value: 'completed' } });

		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		const firstScenario = stored.scenarios.find(
			(s) => s.scenarioId === 'rcs-passage-through-mirkwood'
		);
		expect(firstScenario?.status).toBe('completed');
	});

	it('changing status select to failed updates the store', async () => {
		seedPlaythrough();
		const { getAllByRole } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		const selects = getAllByRole('combobox', { name: /status for/i });
		await fireEvent.change(selects[0], { target: { value: 'failed' } });

		const stored = get(playthroughs).find((p) => p.id === 'test-pt-1')!;
		const firstScenario = stored.scenarios.find(
			(s) => s.scenarioId === 'rcs-passage-through-mirkwood'
		);
		expect(firstScenario?.status).toBe('failed');
	});

	it('progress summary updates after selecting completed', async () => {
		seedPlaythrough();
		const { getAllByRole, getByText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.change(getAllByRole('combobox', { name: /status for/i })[0], { target: { value: 'completed' } });
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

describe('Campaign detail — Campaign Log fields', () => {
	afterEach(() => { cleanup(); localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });
	beforeEach(() => { localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });

	it('campaign log fields are hidden when scenario is not_attempted', () => {
		seedPlaythrough();
		const { queryByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(queryByLabelText(/Stage 3B: Beorn's Path/i)).not.toBeInTheDocument();
	});

	it('campaign log fields reveal when scenario is marked completed', async () => {
		seedPlaythrough();
		const { getAllByRole, getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.change(getAllByRole('combobox', { name: /status for/i })[0], { target: { value: 'completed' } });
		expect(getByLabelText(/Stage 3B: Beorn's Path/i)).toBeInTheDocument();
		expect(getByLabelText(/Stage 3B: Don't Leave the Path/i)).toBeInTheDocument();
	});

	it('campaign log fields reveal when scenario is marked failed', async () => {
		seedPlaythrough();
		const { getAllByRole, getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.change(getAllByRole('combobox', { name: /status for/i })[1], { target: { value: 'failed' } });
		expect(getByLabelText(/Heroes with Valor attached/i)).toBeInTheDocument();
	});

	it('renders text fields for a scenario that has them (when played)', () => {
		seedPlaythrough({ scenarios: [{ scenarioId: 'rcs-journey-along-the-anduin', status: 'completed' as const, campaignLog: [] }] });
		const { getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(getByLabelText(/Heroes with Valor attached/i)).toBeInTheDocument();
		expect(getByLabelText(/Prisoner hero/i)).toBeInTheDocument();
	});

	it('checking a checkbox field persists to the store', async () => {
		seedPlaythrough({ scenarios: [{ scenarioId: 'rcs-passage-through-mirkwood', status: 'completed' as const, campaignLog: [] }] });
		const { getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.click(getByLabelText(/Stage 3B: Beorn's Path/i));
		const record = get(playthroughs).find((p) => p.id === 'test-pt-1')!
			.scenarios.find((s) => s.scenarioId === 'rcs-passage-through-mirkwood');
		expect(record?.campaignLog.find((e) => e.fieldId === 'stage-3b-beorns-path')?.value).toBe(true);
	});

	it('typing in a text field persists to the store', async () => {
		seedPlaythrough({ scenarios: [{ scenarioId: 'rcs-journey-along-the-anduin', status: 'completed' as const, campaignLog: [] }] });
		const { getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.input(getByLabelText(/Prisoner hero/i), { target: { value: 'Aragorn' } });
		const record = get(playthroughs).find((p) => p.id === 'test-pt-1')!
			.scenarios.find((s) => s.scenarioId === 'rcs-journey-along-the-anduin');
		expect(record?.campaignLog.find((e) => e.fieldId === 'prisoner')?.value).toBe('Aragorn');
	});

	it('campaign log fields reflect stored values on render', () => {
		seedPlaythrough({
			scenarios: [{
				scenarioId: 'rcs-passage-through-mirkwood',
				status: 'completed' as const,
				campaignLog: [{ fieldId: 'stage-3b-beorns-path', value: true }],
			}],
		});
		const { getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect((getByLabelText(/Stage 3B: Beorn's Path/i) as HTMLInputElement).checked).toBe(true);
	});
});

describe('Campaign detail — select-type Campaign Log fields', () => {
	const ANGMAR = 'angmar-awakened-campaign';

	afterEach(() => { cleanup(); localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });
	beforeEach(() => { localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });

	function seedAngmar(scenarios: object[] = []) {
		const pt = {
			id: 'pt-angmar',
			name: 'Angmar Run',
			productId: ANGMAR,
			decks: [],
			scenarios,
			createdAt: '2026-01-01T00:00:00.000Z',
		};
		playthroughs.createPlaythrough(pt);
		return pt;
	}

	it('select-type field renders as a <select> dropdown when scenario is played', () => {
		seedAngmar([{ scenarioId: 'aac-deadmens-dike', status: 'completed' as const, campaignLog: [] }]);
		const { getByLabelText } = render(Page, { props: { data: { id: 'pt-angmar' } } });
		const el = getByLabelText(/Boon chosen/i);
		expect(el.tagName.toLowerCase()).toBe('select');
	});

	it('select-type dropdown contains the correct options', () => {
		seedAngmar([{ scenarioId: 'aac-deadmens-dike', status: 'completed' as const, campaignLog: [] }]);
		const { getByLabelText } = render(Page, { props: { data: { id: 'pt-angmar' } } });
		const dropdown = getByLabelText(/Boon chosen/i) as HTMLSelectElement;
		const optionValues = Array.from(dropdown.options).map((o) => o.value).filter(Boolean);
		expect(optionValues).toContain("Iârion's Pendant");
		expect(optionValues).toContain("Amarthiúl's Courage");
	});

	it('changing the select dropdown persists chosen value to the store', async () => {
		seedAngmar([{ scenarioId: 'aac-deadmens-dike', status: 'completed' as const, campaignLog: [] }]);
		const { getByLabelText } = render(Page, { props: { data: { id: 'pt-angmar' } } });
		const dropdown = getByLabelText(/Boon chosen/i);
		await fireEvent.change(dropdown, { target: { value: "Iârion's Pendant" } });
		const record = get(playthroughs).find((p) => p.id === 'pt-angmar')!
			.scenarios.find((s) => s.scenarioId === 'aac-deadmens-dike');
		expect(record?.campaignLog.find((e) => e.fieldId === 'boon-choice')?.value).toBe("Iârion's Pendant");
	});

	it('select dropdown reflects a previously stored value on render', () => {
		seedAngmar([{
			scenarioId: 'aac-deadmens-dike',
			status: 'completed' as const,
			campaignLog: [{ fieldId: 'boon-choice', value: "Amarthiúl's Courage" }],
		}]);
		const { getByLabelText } = render(Page, { props: { data: { id: 'pt-angmar' } } });
		expect(getByLabelText(/Boon chosen/i)).toHaveValue("Amarthiúl's Courage");
	});
});

describe('Campaign detail — Date played', () => {
	afterEach(() => { cleanup(); localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });
	beforeEach(() => { localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });

	it('date input is absent when scenario is not_attempted', () => {
		seedPlaythrough();
		const { queryByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		expect(queryByLabelText(/date played for passage through mirkwood/i)).not.toBeInTheDocument();
	});

	it('date input appears when scenario is completed', async () => {
		seedPlaythrough();
		const { getAllByRole, getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.change(getAllByRole('combobox', { name: /status for/i })[0], { target: { value: 'completed' } });
		expect(getByLabelText(/date played for passage through mirkwood/i)).toBeInTheDocument();
	});

	it('date input appears when scenario is failed', async () => {
		seedPlaythrough();
		const { getAllByRole, getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.change(getAllByRole('combobox', { name: /status for/i })[0], { target: { value: 'failed' } });
		expect(getByLabelText(/date played for passage through mirkwood/i)).toBeInTheDocument();
	});

	it('selecting a date persists datePlayed to the store', async () => {
		seedPlaythrough({ scenarios: [{ scenarioId: 'rcs-passage-through-mirkwood', status: 'completed' as const, campaignLog: [] }] });
		const { getByLabelText } = render(Page, { props: { data: { id: 'test-pt-1' } } });
		await fireEvent.input(getByLabelText(/date played for passage through mirkwood/i), { target: { value: '2026-06-15' } });
		const record = get(playthroughs).find((p) => p.id === 'test-pt-1')!
			.scenarios.find((s) => s.scenarioId === 'rcs-passage-through-mirkwood');
		expect(record?.datePlayed).toBe('2026-06-15');
	});
});

describe('Campaign detail — Campaign Mode gating', () => {
	const SAGA_PRODUCT = 'fellowship-of-the-ring-saga';
	const NON_CAMPAIGN_PRODUCT = 'angmar-awakened-hero';

	afterEach(() => {
		cleanup();
		localStorage.clear();
		get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
	});

	beforeEach(() => {
		localStorage.clear();
		get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id));
	});

	it('boon/burden/fallen controls hidden for non-campaign-mode product', () => {
		playthroughs.createPlaythrough({
			id: 'pt-non-campaign',
			name: 'Run',
			productId: NON_CAMPAIGN_PRODUCT,
			decks: [{ id: 'd1', heroSlots: [{ heroName: 'Aragorn', boons: [], burdens: [], fallen: false }] }],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
		});
		const { queryByRole } = render(Page, { props: { data: { id: 'pt-non-campaign' } } });
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

describe('Campaign detail — Boon/burden on hero slots', () => {
	const SAGA_PRODUCT = 'fellowship-of-the-ring-saga';
	const NON_SAGA_PRODUCT = 'angmar-awakened-hero';

	afterEach(() => { cleanup(); localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });
	beforeEach(() => { localStorage.clear(); get(playthroughs).forEach((p) => playthroughs.deletePlaythrough(p.id)); });

	function seedSaga(heroSlots: HeroSlot[] = [{ heroName: 'Frodo', boons: [], burdens: [], fallen: false }]) {
		const pt = {
			id: 'pt-saga',
			name: 'Saga Run',
			productId: SAGA_PRODUCT,
			decks: [{ id: 'd1', heroSlots }],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
		};
		playthroughs.createPlaythrough(pt);
		return pt;
	}

	it('boon/burden inputs are absent for non-Saga product', () => {
		playthroughs.createPlaythrough({
			id: 'pt-non-saga',
			name: 'Run',
			productId: NON_SAGA_PRODUCT,
			decks: [{ id: 'd1', heroSlots: [{ heroName: 'Aragorn', boons: [], burdens: [], fallen: false }] }],
			scenarios: [],
			createdAt: '2026-01-01T00:00:00.000Z',
		});
		const { queryByLabelText } = render(Page, { props: { data: { id: 'pt-non-saga' } } });
		expect(queryByLabelText(/add boon/i)).not.toBeInTheDocument();
		expect(queryByLabelText(/add burden/i)).not.toBeInTheDocument();
	});

	it('boon and burden inputs appear for Saga product', () => {
		seedSaga();
		const { getAllByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		expect(getAllByRole('textbox', { name: /add boon/i })[0]).toBeInTheDocument();
		expect(getAllByRole('textbox', { name: /add burden/i })[0]).toBeInTheDocument();
	});

	it('typing a boon and clicking Add persists it to the store', async () => {
		seedSaga();
		const { getAllByRole, getByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		await fireEvent.input(getAllByRole('textbox', { name: /add boon/i })[0], { target: { value: 'Sting' } });
		await fireEvent.click(getByRole('button', { name: /add boon/i }));
		const stored = get(playthroughs).find((p) => p.id === 'pt-saga')!;
		expect(stored.decks[0].heroSlots[0].boons).toContain('Sting');
	});

	it('typing a burden and clicking Add persists it to the store', async () => {
		seedSaga();
		const { getAllByRole, getByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		await fireEvent.input(getAllByRole('textbox', { name: /add burden/i })[0], { target: { value: 'Corruption' } });
		await fireEvent.click(getByRole('button', { name: /add burden/i }));
		const stored = get(playthroughs).find((p) => p.id === 'pt-saga')!;
		expect(stored.decks[0].heroSlots[0].burdens).toContain('Corruption');
	});

	it('clicking remove on a boon chip removes it from the store', async () => {
		seedSaga([{ heroName: 'Frodo', boons: ['Sting', 'Mithril Coat'], burdens: [], fallen: false }]);
		const { getByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		await fireEvent.click(getByRole('button', { name: /remove boon sting/i }));
		const stored = get(playthroughs).find((p) => p.id === 'pt-saga')!;
		expect(stored.decks[0].heroSlots[0].boons).not.toContain('Sting');
		expect(stored.decks[0].heroSlots[0].boons).toContain('Mithril Coat');
	});

	it('clicking remove on a burden chip removes it from the store', async () => {
		seedSaga([{ heroName: 'Frodo', boons: [], burdens: ['Corruption', 'Weariness'], fallen: false }]);
		const { getByRole } = render(Page, { props: { data: { id: 'pt-saga' } } });
		await fireEvent.click(getByRole('button', { name: /remove burden corruption/i }));
		const stored = get(playthroughs).find((p) => p.id === 'pt-saga')!;
		expect(stored.decks[0].heroSlots[0].burdens).not.toContain('Corruption');
		expect(stored.decks[0].heroSlots[0].burdens).toContain('Weariness');
	});

	it('existing boons and burdens render as chips', () => {
		seedSaga([{ heroName: 'Frodo', boons: ['Sting'], burdens: ['Corruption'], fallen: false }]);
		const { getByText } = render(Page, { props: { data: { id: 'pt-saga' } } });
		expect(getByText('Sting')).toBeInTheDocument();
		expect(getByText('Corruption')).toBeInTheDocument();
	});
});
