import type { RuleEntry } from '$lib/data/rules';

export type TextSegment = { type: 'text'; value: string };
export type KeywordSegment = { type: 'keyword'; name: string };
export type Segment = TextSegment | KeywordSegment;

export function parseKeywords(text: string): Segment[] {
	const parts = text.split(/\[\[([^\]]+)\]\]/);
	const segments: Segment[] = [];
	for (let i = 0; i < parts.length; i++) {
		if (i % 2 === 0) {
			if (parts[i] !== '') segments.push({ type: 'text', value: parts[i] });
		} else {
			segments.push({ type: 'keyword', name: parts[i] });
		}
	}
	return segments;
}

export function resolveKeyword(name: string, rules: RuleEntry[]): RuleEntry | undefined {
	return (
		rules.find((r) => r.name === name) ??
		rules.find((r) => r.pattern !== undefined && new RegExp(`^${r.pattern}$`).test(name))
	);
}
