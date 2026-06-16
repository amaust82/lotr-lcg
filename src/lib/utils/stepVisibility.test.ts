import { describe, it, expect } from 'vitest';
import { isStepVisible } from './stepVisibility';
import type { CollectionState } from '$lib/stores/collection';

const owned: CollectionState = {
	products: { 'revised-core-set': true },
	showEverything: false,
};

const showAll: CollectionState = {
	products: { 'revised-core-set': true },
	showEverything: true,
};

describe('isStepVisible', () => {
	it('step with no product is always visible', () => {
		expect(isStepVisible({ text: 'Do a thing.' }, owned)).toBe(true);
	});

	it('step with the core set product is always visible', () => {
		expect(isStepVisible({ text: 'Do a thing.', product: 'revised-core-set' }, owned)).toBe(true);
	});

	it('step with a non-owned product is hidden', () => {
		expect(isStepVisible({ text: 'Do a thing.', product: 'angmar-awakened-hero' }, owned)).toBe(false);
	});

	it('showEverything makes non-owned product steps visible', () => {
		expect(isStepVisible({ text: 'Do a thing.', product: 'angmar-awakened-hero' }, showAll)).toBe(true);
	});
});
