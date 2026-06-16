import { describe, it, expect } from 'vitest';
import { REVISED_CORE_SET, rules } from './rules';

describe('Product: Revised Core Set', () => {
	it('is defined with correct id and locked: true', () => {
		expect(REVISED_CORE_SET.id).toBe('revised-core-set');
		expect(REVISED_CORE_SET.locked).toBe(true);
		expect(REVISED_CORE_SET.name).toBeTruthy();
	});
});

describe('rules array', () => {
	it('is non-empty', () => {
		expect(rules.length).toBeGreaterThan(0);
	});

	const PHASE_KEYWORDS = ['Surge', 'Doomed X', 'Peril', 'Sentinel', 'Ranged', 'Travel', 'Shadow'];

	it.each(PHASE_KEYWORDS)('contains an entry for %s', (keyword) => {
		const entry = rules.find((r) => r.name === keyword);
		expect(entry).toBeDefined();
	});

	it('every entry has required fields populated', () => {
		for (const entry of rules) {
			expect(entry.name, `${entry.name}.name`).toBeTruthy();
			expect(entry.type, `${entry.name}.type`).toMatch(/^(keyword|timing|mechanic)$/);
			expect(entry.product, `${entry.name}.product`).toBeTruthy();
			expect(entry.ref, `${entry.name}.ref`).toBeTruthy();
			expect(entry.summary, `${entry.name}.summary`).toBeTruthy();
			expect(Array.isArray(entry.related), `${entry.name}.related`).toBe(true);
		}
	});

	it('variable keywords include a pattern that matches numeric instances', () => {
		const doomed = rules.find((r) => r.name === 'Doomed X');
		expect(doomed?.pattern).toBeDefined();
		const re = new RegExp(doomed!.pattern!);
		expect(re.test('Doomed 2')).toBe(true);
		expect(re.test('Doomed 3')).toBe(true);
		expect(re.test('Surge')).toBe(false);
	});
});
