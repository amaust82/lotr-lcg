// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/svelte';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
import { get } from 'svelte/store';
import { playthroughs } from '$lib/stores/playthroughs';
import Page from './+page.svelte';

afterEach(() => {
	cleanup();
	localStorage.clear();
});

beforeEach(() => {
	localStorage.clear();
	// Reset playthroughs store to empty
	const all = get(playthroughs);
	all.forEach((p) => playthroughs.deletePlaythrough(p.id));
});

describe('Campaigns screen', () => {
	it('renders empty state when no playthroughs exist', () => {
		const { getByText } = render(Page);
		expect(getByText(/no campaigns yet/i)).toBeInTheDocument();
	});

	it('renders playthrough names from store', () => {
		playthroughs.createPlaythrough({
			id: 'p1', name: 'Mirkwood Run', productId: 'revised-core-set',
			decks: [], scenarios: [], createdAt: '2026-01-01'
		});
		const { getByText } = render(Page);
		expect(getByText('Mirkwood Run')).toBeInTheDocument();
	});

	it('has a create form with a name input and product select', () => {
		const { getByRole, getByLabelText } = render(Page);
		expect(getByLabelText(/name/i)).toBeInTheDocument();
		expect(getByRole('combobox', { name: /product/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /start campaign/i })).toBeInTheDocument();
	});

	it('submitting create form adds a playthrough to the store', async () => {
		const { getByLabelText, getByRole } = render(Page);
		const nameInput = getByLabelText(/name/i);
		const productSelect = getByRole('combobox', { name: /product/i });
		const submitBtn = getByRole('button', { name: /start campaign/i });

		await fireEvent.input(nameInput, { target: { value: 'My Campaign' } });
		// Select first available option (value is already set by default)
		await fireEvent.click(submitBtn);

		const all = get(playthroughs);
		expect(all).toHaveLength(1);
		expect(all[0].name).toBe('My Campaign');
	});

	it('delete button shows confirmation before removing', async () => {
		playthroughs.createPlaythrough({
			id: 'p1', name: 'Mirkwood Run', productId: 'revised-core-set',
			decks: [], scenarios: [], createdAt: '2026-01-01'
		});
		const { getByRole, queryByRole } = render(Page);
		const deleteBtn = getByRole('button', { name: /delete/i });
		expect(queryByRole('button', { name: /confirm/i })).not.toBeInTheDocument();
		await fireEvent.click(deleteBtn);
		expect(getByRole('button', { name: /confirm/i })).toBeInTheDocument();
		expect(get(playthroughs)).toHaveLength(1); // not deleted yet
	});

	it('confirming delete removes the playthrough from the store', async () => {
		playthroughs.createPlaythrough({
			id: 'p1', name: 'Mirkwood Run', productId: 'revised-core-set',
			decks: [], scenarios: [], createdAt: '2026-01-01'
		});
		const { getByRole } = render(Page);
		await fireEvent.click(getByRole('button', { name: /delete/i }));
		await fireEvent.click(getByRole('button', { name: /confirm/i }));
		expect(get(playthroughs)).toHaveLength(0);
	});

	it('renders playthroughs in newest-first order', () => {
		playthroughs.createPlaythrough({
			id: 'p1', name: 'Older Run', productId: 'revised-core-set',
			decks: [], scenarios: [], createdAt: '2026-01-01'
		});
		playthroughs.createPlaythrough({
			id: 'p2', name: 'Newer Run', productId: 'revised-core-set',
			decks: [], scenarios: [], createdAt: '2026-06-01'
		});
		const { getAllByRole } = render(Page);
		const items = getAllByRole('listitem');
		expect(items[0]).toHaveTextContent('Newer Run');
		expect(items[1]).toHaveTextContent('Older Run');
	});
});
