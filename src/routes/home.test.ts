// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import Page from './+page.svelte';

afterEach(() => cleanup());

describe('Home screen', () => {
	it('renders three navigation tiles', () => {
		const { getAllByRole } = render(Page);
		const links = getAllByRole('link');
		expect(links).toHaveLength(3);
	});

	it('Turn Guide tile links to /turn-guide/resource', () => {
		const { getByRole } = render(Page);
		expect(getByRole('link', { name: /turn guide/i })).toHaveAttribute('href', '/turn-guide/resource');
	});

	it('Collection tile links to /collection', () => {
		const { getByRole } = render(Page);
		expect(getByRole('link', { name: /collection/i })).toHaveAttribute('href', '/collection');
	});

	it('Campaigns tile links to /campaigns', () => {
		const { getByRole } = render(Page);
		expect(getByRole('link', { name: /campaigns/i })).toHaveAttribute('href', '/campaigns');
	});

	it('Rules Reference tile is not present', () => {
		const { queryByRole } = render(Page);
		expect(queryByRole('link', { name: /rules reference/i })).not.toBeInTheDocument();
	});
});
