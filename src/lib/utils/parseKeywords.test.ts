import { describe, it, expect } from 'vitest';
import { parseKeywords, resolveKeyword } from './parseKeywords';
import type { RuleEntry } from '$lib/data/rules';

const surge: RuleEntry = {
	name: 'Surge',
	type: 'keyword',
	product: 'revised-core-set',
	ref: '1.38',
	summary: 'Reveal one additional encounter card.',
	related: [],
};

const doomed: RuleEntry = {
	name: 'Doomed X',
	type: 'keyword',
	product: 'revised-core-set',
	ref: '1.19',
	summary: 'Each player raises their threat by X.',
	related: [],
	pattern: 'Doomed \\d+',
};

const stubRules: RuleEntry[] = [surge, doomed];

// ── parseKeywords ────────────────────────────────────────────────────────────

describe('parseKeywords', () => {
	it('plain text with no markers returns a single text segment', () => {
		const result = parseKeywords('Reveal one card.');
		expect(result).toEqual([{ type: 'text', value: 'Reveal one card.' }]);
	});

	it('single keyword in the middle splits into text / keyword / text', () => {
		const result = parseKeywords('A card with [[Surge]] reveals one more.');
		expect(result).toEqual([
			{ type: 'text', value: 'A card with ' },
			{ type: 'keyword', name: 'Surge' },
			{ type: 'text', value: ' reveals one more.' },
		]);
	});

	it('keyword at the start produces keyword then text', () => {
		const result = parseKeywords('[[Surge]]: reveal one more card.');
		expect(result).toEqual([
			{ type: 'keyword', name: 'Surge' },
			{ type: 'text', value: ': reveal one more card.' },
		]);
	});

	it('keyword at the end produces text then keyword', () => {
		const result = parseKeywords('Cards may have [[Surge]]');
		expect(result).toEqual([
			{ type: 'text', value: 'Cards may have ' },
			{ type: 'keyword', name: 'Surge' },
		]);
	});

	it('multiple keywords produce alternating segments', () => {
		const result = parseKeywords('[[Surge]] and [[Peril]] both apply.');
		expect(result).toEqual([
			{ type: 'keyword', name: 'Surge' },
			{ type: 'text', value: ' and ' },
			{ type: 'keyword', name: 'Peril' },
			{ type: 'text', value: ' both apply.' },
		]);
	});

	it('empty string returns empty array', () => {
		expect(parseKeywords('')).toEqual([]);
	});
});

// ── resolveKeyword ───────────────────────────────────────────────────────────

describe('resolveKeyword', () => {
	it('finds an entry by exact name', () => {
		expect(resolveKeyword('Surge', stubRules)).toBe(surge);
	});

	it('resolves a variable keyword instance via pattern match', () => {
		expect(resolveKeyword('Doomed 2', stubRules)).toBe(doomed);
		expect(resolveKeyword('Doomed 99', stubRules)).toBe(doomed);
	});

	it('returns undefined for an unrecognised name', () => {
		expect(resolveKeyword('Unknown', stubRules)).toBeUndefined();
	});
});
