import { describe, it, expect } from 'vitest';
import { products } from './rules';
import { campaigns } from './campaigns';

const CAMPAIGN_MODE_IDS = new Set([
	'revised-core-set',
	'dark-of-mirkwood',
	'angmar-awakened-campaign',
	'dream-chaser-campaign',
	'ered-mithrin-campaign',
	'fellowship-of-the-ring-saga',
	'two-towers-saga',
	'return-of-the-king-saga',
]);

describe('Product.hasCampaignMode', () => {
	it('all campaign-mode products are flagged hasCampaignMode: true', () => {
		for (const id of CAMPAIGN_MODE_IDS) {
			const product = products.find((p) => p.id === id);
			expect(product, `product ${id} not found`).toBeDefined();
			expect(product!.hasCampaignMode, `${id}.hasCampaignMode`).toBe(true);
		}
	});

	it('all non-campaign products are flagged hasCampaignMode: false', () => {
		for (const product of products) {
			if (!CAMPAIGN_MODE_IDS.has(product.id)) {
				expect(product.hasCampaignMode, `${product.id}.hasCampaignMode`).toBe(false);
			}
		}
	});
});

describe('Dark of Mirkwood campaignLog fields', () => {
	const DOM_SCENARIO_IDS = ['dom-the-oath', 'dom-the-caves-of-nibin-dum'];

	it.each(DOM_SCENARIO_IDS)('%s has a non-empty campaignLog', (id) => {
		const scenario = campaigns['dark-of-mirkwood'].find((s) => s.id === id);
		expect(scenario, `scenario ${id} not found`).toBeDefined();
		expect(scenario!.campaignLog?.length, `${id}.campaignLog is empty`).toBeGreaterThan(0);
	});

	it.each(DOM_SCENARIO_IDS)('%s campaignLog fields are well-formed', (id) => {
		const scenario = campaigns['dark-of-mirkwood'].find((s) => s.id === id)!;
		for (const field of scenario.campaignLog ?? []) {
			expect(field.id, `${id}: field missing id`).toBeTruthy();
			expect(field.label, `${id}: field ${field.id} missing label`).toBeTruthy();
			expect(['checkbox', 'text', 'select'], `${id}: field ${field.id} invalid type`).toContain(field.type);
		}
	});
});

describe('Revised Core Set campaignLog fields', () => {
	const RCS_SCENARIO_IDS = [
		'rcs-passage-through-mirkwood',
		'rcs-journey-along-the-anduin',
		'rcs-escape-from-dol-guldur',
	];

	it.each(RCS_SCENARIO_IDS)('%s has a non-empty campaignLog', (id) => {
		const scenario = campaigns['revised-core-set'].find((s) => s.id === id);
		expect(scenario, `scenario ${id} not found`).toBeDefined();
		expect(scenario!.campaignLog?.length, `${id}.campaignLog is empty`).toBeGreaterThan(0);
	});

	it.each(RCS_SCENARIO_IDS)('%s campaignLog fields are well-formed', (id) => {
		const scenario = campaigns['revised-core-set'].find((s) => s.id === id)!;
		for (const field of scenario.campaignLog ?? []) {
			expect(field.id, `${id}: field missing id`).toBeTruthy();
			expect(field.label, `${id}: field ${field.id} missing label`).toBeTruthy();
			expect(['checkbox', 'text', 'select'], `${id}: field ${field.id} invalid type`).toContain(field.type);
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

	it('every campaign-mode product appears in campaigns', () => {
		for (const id of CAMPAIGN_MODE_IDS) {
			expect(campaigns[id], `campaigns missing campaign-mode product ${id}`).toBeDefined();
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

describe('select-type CampaignLogFields', () => {
	it("Deadmen's Dike boon-choice field is type select with correct options", () => {
		const scenario = campaigns['angmar-awakened-campaign'].find((s) => s.id === 'aac-deadmens-dike');
		const field = scenario!.campaignLog?.find((f) => f.id === 'boon-choice');
		expect(field?.type).toBe('select');
		expect(field?.options).toEqual(["Iârion's Pendant", "Amarthiúl's Courage"]);
	});

	it('Dream-chaser Raid on the Grey Havens weapon-boon field is type select with correct options', () => {
		const scenario = campaigns['dream-chaser-campaign'].find((s) => s.id === 'dcc-raid-on-the-grey-havens');
		const field = scenario!.campaignLog?.find((f) => f.id === 'weapon-boon');
		expect(field?.type).toBe('select');
		expect(field?.options).toEqual(['Parrying Cutlass', 'Throwing Axe']);
	});

	it('all select-type fields have non-empty options arrays', () => {
		for (const scenarios of Object.values(campaigns)) {
			for (const scenario of scenarios) {
				for (const field of scenario.campaignLog ?? []) {
					if (field.type === 'select') {
						expect(field.options, `${scenario.id}.${field.id}: select field missing options`).toBeDefined();
						expect(field.options!.length, `${scenario.id}.${field.id}: select field has empty options`).toBeGreaterThan(0);
					}
				}
			}
		}
	});
});
