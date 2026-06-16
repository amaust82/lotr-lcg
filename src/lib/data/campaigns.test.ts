import { describe, it, expect } from 'vitest';
import { products } from './rules';
import { campaigns } from './campaigns';

const SAGA_IDS = new Set([
	'angmar-awakened-campaign',
	'dream-chaser-campaign',
	'ered-mithrin-campaign',
	'fellowship-of-the-ring-saga',
	'two-towers-saga',
	'return-of-the-king-saga',
]);

describe('Product.isSaga', () => {
	it('all saga expansions are flagged isSaga: true', () => {
		for (const id of SAGA_IDS) {
			const product = products.find((p) => p.id === id);
			expect(product, `product ${id} not found`).toBeDefined();
			expect(product!.isSaga, `${id}.isSaga`).toBe(true);
		}
	});

	it('all non-saga products are flagged isSaga: false', () => {
		for (const product of products) {
			if (!SAGA_IDS.has(product.id)) {
				expect(product.isSaga, `${product.id}.isSaga`).toBe(false);
			}
		}
	});
});

describe('campaigns', () => {
	it('every entry has a non-empty scenario list', () => {
		for (const [productId, scenarios] of Object.entries(campaigns)) {
			expect(scenarios.length, `${productId} scenario list`).toBeGreaterThan(0);
		}
	});

	it('all scenario IDs are globally unique', () => {
		const seen = new Map<string, string>();
		for (const [productId, scenarios] of Object.entries(campaigns)) {
			for (const scenario of scenarios) {
				expect(seen.has(scenario.id), `duplicate id "${scenario.id}" in ${productId}`).toBe(false);
				seen.set(scenario.id, productId);
			}
		}
	});

	it('every saga product appears in campaigns', () => {
		for (const id of SAGA_IDS) {
			expect(campaigns[id], `campaigns missing saga product ${id}`).toBeDefined();
		}
	});

	it('all entries have required scenario fields', () => {
		for (const [productId, scenarios] of Object.entries(campaigns)) {
			for (const scenario of scenarios) {
				expect(scenario.id, `${productId} scenario missing id`).toBeTruthy();
				expect(scenario.name, `${productId} scenario ${scenario.id} missing name`).toBeTruthy();
			}
		}
	});
});
