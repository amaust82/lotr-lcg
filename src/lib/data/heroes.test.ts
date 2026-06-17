import { describe, it, expect } from 'vitest';
import { heroes } from './heroes';
import { products } from './rules';

const VALID_SPHERES = new Set([
	'Leadership',
	'Tactics',
	'Spirit',
	'Lore',
	'Baggins',
	'Fellowship',
	'Neutral',
]);

const KNOWN_PRODUCT_IDS = new Set(products.map((p) => p.id));

describe('heroes data', () => {
	it('exports a non-empty array', () => {
		expect(Array.isArray(heroes)).toBe(true);
		expect(heroes.length).toBeGreaterThan(0);
	});

	it('every entry has all required fields', () => {
		for (const hero of heroes) {
			expect(hero.name, `hero missing name: ${JSON.stringify(hero)}`).toBeTruthy();
			expect(hero.productId, `${hero.name}: missing productId`).toBeTruthy();
			expect(hero.sphere, `${hero.name}: missing sphere`).toBeTruthy();
			expect(typeof hero.traits, `${hero.name}: traits must be a string`).toBe('string');
		}
	});

	it('all spheres are from the valid set', () => {
		for (const hero of heroes) {
			expect(VALID_SPHERES.has(hero.sphere), `${hero.name}: invalid sphere "${hero.sphere}"`).toBe(true);
		}
	});

	it('all productIds reference a known product', () => {
		for (const hero of heroes) {
			expect(
				KNOWN_PRODUCT_IDS.has(hero.productId),
				`${hero.name}: unknown productId "${hero.productId}"`
			).toBe(true);
		}
	});

	it('no duplicate name + sphere combination', () => {
		const seen = new Set<string>();
		for (const hero of heroes) {
			const key = `${hero.name}|${hero.sphere}`;
			expect(seen.has(key), `duplicate hero: ${hero.name} (${hero.sphere})`).toBe(false);
			seen.add(key);
		}
	});
});
