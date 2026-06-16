// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { collection } from '$lib/stores/collection';
import Page from './+page.svelte';

afterEach(() => {
	cleanup();
	localStorage.clear();
	collection.setShowEverything(false);
});

describe('Collection Manager screen', () => {
	it('renders Revised Core Set tile', () => {
		const { getByRole } = render(Page);
		expect(getByRole('button', { name: /revised core set/i })).toBeInTheDocument();
	});

	it('Revised Core Set tile is disabled and pressed', () => {
		const { getByRole } = render(Page);
		const tile = getByRole('button', { name: /revised core set/i });
		expect(tile).toBeDisabled();
		expect(tile).toHaveAttribute('aria-pressed', 'true');
	});

	it('Revised Core Set image is present', () => {
		const { getByAltText } = render(Page);
		const img = getByAltText(/revised core set/i);
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', '/products/core-box.png');
	});

	it('renders a show everything switch', () => {
		const { getByRole } = render(Page);
		expect(getByRole('switch', { name: /show everything/i })).toBeInTheDocument();
	});

	it('renders expansion tiles for products with rule entries', () => {
		const { getByRole } = render(Page);
		expect(getByRole('button', { name: /dwarves of durin/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /elves of lórien/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /defenders of gondor/i })).toBeInTheDocument();
		expect(getByRole('button', { name: /riders of rohan/i })).toBeInTheDocument();
	});

	it('tapping show everything switch toggles the store flag', async () => {
		const { getByRole } = render(Page);
		const sw = getByRole('switch', { name: /show everything/i });
		await fireEvent.click(sw);
		expect(get(collection).showEverything).toBe(true);
	});
});
