// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';

afterEach(cleanup);
import Home from './+page.svelte';

describe('Home screen', () => {
	it('renders a link to the Turn Guide', () => {
		const { getByRole } = render(Home);
		const link = getByRole('link', { name: /turn guide/i });
		expect(link).toHaveAttribute('href', '/turn-guide/resource');
	});

	it('renders a link to Rules Reference', () => {
		const { getByRole } = render(Home);
		const link = getByRole('link', { name: /rules reference/i });
		expect(link).toHaveAttribute('href', '/rules');
	});

	it('renders a link to Collection Manager', () => {
		const { getByRole } = render(Home);
		const link = getByRole('link', { name: /collection manager/i });
		expect(link).toHaveAttribute('href', '/collection');
	});

	it('renders exactly three navigation tiles', () => {
		const { getAllByRole } = render(Home);
		const navLinks = getAllByRole('link').filter(
			(l) => (l as HTMLAnchorElement).closest('nav')
		);
		expect(navLinks).toHaveLength(3);
	});
});
