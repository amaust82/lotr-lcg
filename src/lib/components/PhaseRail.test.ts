// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import PhaseRail from './PhaseRail.svelte';
import type { Phase } from '$lib/data/phases.js';

const stubPhases: Phase[] = [
	{ name: 'Resource', slug: 'resource', eyebrow: '', subtitle: '', sections: [] },
	{ name: 'Planning', slug: 'planning', eyebrow: '', subtitle: '', sections: [] },
	{ name: 'Quest',    slug: 'quest',    eyebrow: '', subtitle: '', sections: [] },
	{ name: 'Travel',   slug: 'travel',   eyebrow: '', subtitle: '', sections: [] },
	{ name: 'Encounter',slug: 'encounter',eyebrow: '', subtitle: '', sections: [] },
	{ name: 'Combat',   slug: 'combat',   eyebrow: '', subtitle: '', sections: [] },
	{ name: 'Refresh',  slug: 'refresh',  eyebrow: '', subtitle: '', sections: [] },
];

describe('PhaseRail tooltips', () => {
	it('renders a tooltip label for each phase node', () => {
		const { getAllByRole } = render(PhaseRail, { phases: stubPhases, currentPhase: 0 });
		const links = getAllByRole('link');
		expect(links).toHaveLength(7);
	});

	it('each node link carries the phase name as aria-label', () => {
		const { getAllByRole } = render(PhaseRail, { phases: stubPhases, currentPhase: 0 });
		const links = getAllByRole('link');
		expect(links[0]).toHaveAccessibleName('Resource Phase');
		expect(links[3]).toHaveAccessibleName('Travel Phase');
		expect(links[6]).toHaveAccessibleName('Refresh Phase');
	});

	it('renders a visible tooltip text element for each node', () => {
		const { container } = render(PhaseRail, { phases: stubPhases, currentPhase: 2 });
		const tooltips = container.querySelectorAll('.node-tooltip');
		expect(tooltips).toHaveLength(7);
		expect(tooltips[0].textContent).toBe('Resource');
		expect(tooltips[2].textContent).toBe('Quest');
		expect(tooltips[6].textContent).toBe('Refresh');
	});

	it('tooltip uses the display-sc font class', () => {
		const { container } = render(PhaseRail, { phases: stubPhases, currentPhase: 0 });
		const tooltip = container.querySelector('.node-tooltip');
		expect(tooltip).toHaveClass('node-tooltip');
	});
});
