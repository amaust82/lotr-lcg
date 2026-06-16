export type RuleEntryType = 'keyword' | 'timing' | 'mechanic';

export interface Product {
	id: string;
	name: string;
	locked: boolean;
	sku?: string;   // publisher product code, e.g. "MEC101"
	image?: string; // image filename (no extension) — defaults to id when absent
}

export interface RuleEntry {
	name: string;
	type: RuleEntryType;
	product: string;
	ref: string;
	summary: string;
	full?: string;
	related: string[];
	pattern?: string;
}

export const REVISED_CORE_SET: Product = {
	id: 'revised-core-set',
	name: 'Revised Core Set',
	locked: true,
	sku: 'MEC101',
	image: 'core-box',
};

export const products: Product[] = [
	REVISED_CORE_SET,
	{ id: 'angmar-awakened-hero',     name: 'Angmar Awakened Hero Expansion',     locked: false },
	{ id: 'angmar-awakened-campaign', name: 'Angmar Awakened Campaign Expansion', locked: false },
	{ id: 'dark-of-mirkwood',         name: 'The Dark of Mirkwood',               locked: false, sku: 'MEC102' },
	{ id: 'defenders-of-gondor',      name: 'Defenders of Gondor',                locked: false, sku: 'MEC105' },
	{ id: 'dream-chaser-hero',        name: 'Dream-chaser Hero Expansion',        locked: false },
	{ id: 'dream-chaser-campaign',    name: 'Dream-chaser Campaign Expansion',    locked: false },
	{ id: 'dwarves-of-durin',         name: 'Dwarves of Durin',                   locked: false, sku: 'MEC103', image: 'dwarves-of-durin-box' },
	{ id: 'elves-of-lorien',          name: 'Elves of Lórien',                    locked: false, sku: 'MEC104', image: 'elves-of-lorien-box' },
	{ id: 'ered-mithrin-hero',        name: 'Ered Mithrin Hero Expansion',        locked: false },
	{ id: 'ered-mithrin-campaign',    name: 'Ered Mithrin Campaign Expansion',    locked: false },
	{ id: 'riders-of-rohan',          name: 'Riders of Rohan',                    locked: false, sku: 'MEC106' },
	{ id: 'fellowship-of-the-ring-saga', name: 'The Fellowship of the Ring',      locked: false },
	{ id: 'two-towers-saga',          name: 'The Two Towers',                     locked: false },
	{ id: 'return-of-the-king-saga',  name: 'The Return of the King',             locked: false },
];

export const rules: RuleEntry[] = [
	// ── Revised Core Set (MEC101) ────────────────────────────────────────────
	{
		name: 'Surge',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.38',
		summary: 'When a card with Surge is revealed from the encounter deck, reveal one additional encounter card.',
		related: ['Doomed X', 'Peril'],
	},
	{
		name: 'Doomed X',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.19',
		summary: 'When a card with Doomed X is revealed, each player raises their threat by X.',
		related: ['Surge', 'Peril'],
		pattern: 'Doomed \\d+',
	},
	{
		name: 'Peril',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.30',
		summary: 'When a card with Peril is revealed during staging, other players cannot take actions or trigger responses.',
		related: ['Surge', 'Doomed X'],
	},
	{
		name: 'Sentinel',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.36',
		summary: 'A character with Sentinel may exhaust to defend an attack made against another player.',
		related: ['Ranged'],
	},
	{
		name: 'Ranged',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.33',
		summary: 'A character with Ranged may be declared as an attacker against enemies engaged with other players.',
		related: ['Sentinel'],
	},
	{
		name: 'Treachery',
		type: 'mechanic',
		product: 'revised-core-set',
		ref: '1.42',
		summary: 'A type of encounter card that is resolved immediately when revealed during staging, then discarded. Unlike enemies and locations, treacheries do not remain in the staging area.',
		related: ['Surge', 'Shadow'],
		pattern: 'Treacheries?',
	},
	{
		name: 'Threat',
		type: 'mechanic',
		product: 'revised-core-set',
		ref: '1.40',
		summary: 'Two related concepts: each player has a personal threat level that rises by 1 each Refresh Phase (defeat at 50), and cards in the staging area contribute threat values that oppose players during questing.',
		related: ['Doomed X', 'Willpower'],
	},
	{
		name: 'Willpower',
		type: 'mechanic',
		product: 'revised-core-set',
		ref: '1.43',
		summary: 'A stat on hero and ally cards representing their contribution to the quest. Characters exhaust to commit their Willpower during the Quest Phase; higher total Willpower than the staging area threat means progress.',
		related: [],
	},
	{
		name: 'Travel',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.41',
		summary: 'A location with a Travel keyword imposes a cost that all players must pay when traveling to that location.',
		related: [],
	},
	{
		name: 'Shadow',
		type: 'keyword',
		product: 'revised-core-set',
		ref: '1.37',
		summary: 'Shadow text appears on encounter cards dealt as shadow cards during combat. The effect triggers when the shadow card is flipped.',
		related: [],
	},

	// ── The Dark of Mirkwood ─────────────────────────────────────────────────
	{
		name: 'Mirkwood Paths Campaign',
		type: 'mechanic',
		product: 'dark-of-mirkwood',
		ref: 'Dark of Mirkwood Rulebook p.7',
		summary: 'Adds two scenarios — The Oath and The Caves of Nibin-dûm — playable standalone, as a two-scenario mini-campaign, or as parts 4–5 of the core set\'s Mirkwood Paths campaign.',
		related: [],
	},

	// ── Dwarves of Durin (MEC103) ────────────────────────────────────────────
	{
		name: 'Dwarven Host',
		type: 'mechanic',
		product: 'dwarves-of-durin',
		ref: 'MEC103',
		summary: 'Dwarven decks grow more powerful as more Dwarves enter play. Dáin Ironfoot grants all ready Dwarf characters +1 Willpower and +1 Attack, making a wide Dwarf board exceptionally efficient.',
		related: [],
	},

	// ── Elves of Lórien (MEC104) ─────────────────────────────────────────────
	{
		name: 'Silvan Recursion',
		type: 'mechanic',
		product: 'elves-of-lorien',
		ref: 'MEC104',
		summary: 'Silvan allies can be returned to hand and replayed to re-trigger their enter-play effects. Cards like The Tree People and Host of Galadhrim return Silvan allies from play to hand, then replay them in the same round for repeated bonuses.',
		related: [],
	},

	// ── Defenders of Gondor (MEC105) ─────────────────────────────────────────
	{
		name: 'Gondor Trait',
		type: 'mechanic',
		product: 'defenders-of-gondor',
		ref: 'MEC105',
		summary: 'Gondor characters gain bonuses when fighting together. Steward of Gondor grants any hero the Gondor trait and provides resource acceleration. Many Gondor cards unlock enhanced effects when your threat is 40 or higher.',
		related: ['Valour'],
	},

	// ── Riders of Rohan (MEC106) ─────────────────────────────────────────────
	{
		name: 'Valour',
		type: 'mechanic',
		product: 'riders-of-rohan',
		ref: 'MEC106 p.6',
		summary: 'Valour Actions and Valour Responses can only be triggered when your threat is 40 or higher. High-threat decks deliberately embrace rising threat to unlock these powerful abilities.',
		full: 'Valour is a trigger that appears on some player cards. Actions and Responses with the Valour trigger — presented as "Valour Action" or "Valour Response" — can only be triggered by a player whose threat is 40 or higher.',
		related: ['Gondor Trait'],
	},
];
