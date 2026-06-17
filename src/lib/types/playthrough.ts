export type HeroSlot = {
	heroName: string;
	boons: string[];
	burdens: string[];
	fallen: boolean;
};

export type Deck = {
	id: string;
	label?: string;
	heroSlots: HeroSlot[];
};

export type CampaignLogEntry = {
	fieldId: string;
	value: boolean | string;
};

export type ScenarioRecord = {
	scenarioId: string;
	status: 'not_attempted' | 'completed' | 'failed';
	datePlayed?: string;
	notes?: string;
	campaignLog: CampaignLogEntry[];
};

export type Playthrough = {
	id: string;
	name: string;
	productId: string;
	decks: Deck[];
	scenarios: ScenarioRecord[];
	createdAt: string;
};
