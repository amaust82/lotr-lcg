export type CampaignLogField = {
	id: string;
	label: string;
	type: 'checkbox' | 'text' | 'select';
	options?: string[];
};

export interface Scenario {
	id: string;
	name: string;
	campaignLog?: CampaignLogField[];
}

export const campaigns: Record<string, Scenario[]> = {
	'revised-core-set': [
		{
			id: 'rcs-passage-through-mirkwood',
			name: 'Passage Through Mirkwood',
			campaignLog: [
				{ id: 'stage-3b-beorns-path',       label: "Stage 3B: Beorn's Path",        type: 'checkbox' },
				{ id: 'stage-3b-dont-leave-the-path', label: "Stage 3B: Don't Leave the Path", type: 'checkbox' },
			],
		},
		{
			id: 'rcs-journey-along-the-anduin',
			name: 'Journey Along the Anduin',
			campaignLog: [
				{ id: 'valor-heroes',  label: 'Heroes with Valor attached',  type: 'text' },
				{ id: 'scarred-heroes', label: 'Heroes with Scarred attached', type: 'text' },
				{ id: 'prisoner',      label: 'Prisoner hero',                type: 'text' },
			],
		},
		{
			id: 'rcs-escape-from-dol-guldur',
			name: 'Escape from Dol Guldur',
			campaignLog: [
				{ id: 'mendor-survived', label: 'Mendor survived', type: 'checkbox' },
			],
		},
	],

	'angmar-awakened-campaign': [
		{
			id: 'aac-intruders-in-chetwood',
			name: 'Intruders in Chetwood',
			campaignLog: [
				{ id: 'protect-the-innocent-damage', label: 'Damage on Protect the Innocent', type: 'text' },
			],
		},
		{
			id: 'aac-the-weather-hills',
			name: 'The Weather Hills',
			campaignLog: [
				{ id: 'protect-the-innocent-damage', label: 'Damage on Protect the Innocent (updated)', type: 'text' },
			],
		},
		{
			id: 'aac-deadmens-dike',
			name: "Deadmen's Dike",
			campaignLog: [
				{ id: 'protect-the-innocent-damage', label: 'Damage on Protect the Innocent (final)', type: 'text' },
				{ id: 'boon-choice', label: 'Boon chosen', type: 'select', options: ["Iârion's Pendant", "Amarthiúl's Courage"] },
			],
		},
		{ id: 'aac-wastes-of-eriador',      name: 'The Wastes of Eriador' },
		{
			id: 'aac-escape-from-mount-gram',
			name: 'Escape from Mount Gram',
			campaignLog: [
				{ id: 'excluded-cards', label: 'Unique cards still in captured deck (excluded from remaining campaign)', type: 'text' },
			],
		},
		{ id: 'aac-across-the-ettenmoors',  name: 'Across the Ettenmoors' },
		{ id: 'aac-treachery-of-rhudaur',   name: 'The Treachery of Rhudaur' },
		{
			id: 'aac-battle-of-carn-dum',
			name: 'The Battle of Carn Dûm',
			campaignLog: [
				{ id: 'hero-damage', label: 'Damage on each hero at end of game', type: 'text' },
			],
		},
		{ id: 'aac-dread-realm',            name: 'The Dread Realm' },
	],

	'dream-chaser-campaign': [
		{ id: 'dcc-voyage-across-belegaer',  name: 'Voyage Across Belegaer' },
		{ id: 'dcc-fate-of-numenor',         name: 'The Fate of Númenor' },
		{
			id: 'dcc-raid-on-the-grey-havens',
			name: 'Raid on the Grey Havens',
			campaignLog: [
				{ id: 'weapon-boon',  label: 'Weapon boon', type: 'select', options: ['Parrying Cutlass', 'Throwing Axe'] },
				{ id: 'weapon-hero',  label: 'Hero with weapon attached',                              type: 'text' },
			],
		},
		{ id: 'dcc-flight-of-the-stormcaller', name: 'Flight of the Stormcaller' },
		{ id: 'dcc-thing-in-the-depths',       name: 'The Thing in the Depths' },
		{ id: 'dcc-temple-of-the-deceived',    name: 'Temple of the Deceived' },
		{ id: 'dcc-the-drowned-ruins',         name: 'The Drowned Ruins' },
		{
			id: 'dcc-storm-on-cobas-haven',
			name: 'A Storm on Cobas Haven',
			campaignLog: [
				{ id: 'gavin-returned', label: 'Gavin returned (spent 4 XP)', type: 'checkbox' },
			],
		},
		{ id: 'dcc-city-of-corsairs',          name: 'The City of Corsairs' },
	],

	'ered-mithrin-campaign': [
		{
			id: 'emc-journey-up-the-anduin',
			name: 'Journey Up the Anduin',
			campaignLog: [
				{ id: 'turayn-oath',          label: "Turayn has taken an oath of vigilance", type: 'checkbox' },
				{ id: 'discovered-treasures', label: 'Treasures discovered',                  type: 'text' },
			],
		},
		{
			id: 'emc-lost-in-mirkwood',
			name: 'Lost in Mirkwood',
			campaignLog: [
				{ id: 'melanwar-guidance',    label: 'Melanwar has given you guidance on traversing Wilderland', type: 'checkbox' },
				{ id: 'discovered-treasures', label: 'Treasures discovered',                                     type: 'text' },
			],
		},
		{
			id: 'emc-the-kings-quest',
			name: "The King's Quest",
			campaignLog: [
				{ id: 'isolde-on-the-hunt',   label: 'Isolde is on the hunt',  type: 'checkbox' },
				{ id: 'discovered-treasures', label: 'Treasures discovered',   type: 'text' },
			],
		},
		{
			id: 'emc-the-withered-heath',
			name: 'The Withered Heath',
			campaignLog: [
				{ id: 'discovered-treasures', label: 'Treasures discovered', type: 'text' },
			],
		},
		{ id: 'emc-roam-across-rhovanion', name: 'Roam Across Rhovanion' },
		{
			id: 'emc-fire-in-the-night',
			name: 'Fire in the Night',
			campaignLog: [
				{ id: 'beldis-care',          label: "Beldis's care has bolstered the heroes' spirits", type: 'checkbox' },
				{ id: 'discovered-treasures', label: 'Treasures discovered',                            type: 'text' },
			],
		},
		{
			id: 'emc-the-ghost-of-framsburg',
			name: 'The Ghost of Framsburg',
			campaignLog: [
				{ id: 'discovered-treasures', label: 'Treasures discovered', type: 'text' },
			],
		},
		{
			id: 'emc-mount-gundabad',
			name: 'Mount Gundabad',
			campaignLog: [
				{ id: 'discovered-treasures', label: 'Treasures discovered', type: 'text' },
			],
		},
		{ id: 'emc-the-fate-of-wilderland', name: 'The Fate of Wilderland' },
	],

	'fellowship-of-the-ring-saga': [
		{ id: 'fotr-a-shadow-of-the-past',    name: 'A Shadow of the Past' },
		{ id: 'fotr-a-knife-in-the-dark',     name: 'A Knife in the Dark' },
		{ id: 'fotr-flight-to-the-ford',      name: 'Flight to the Ford' },
		{ id: 'fotr-the-ring-goes-south',     name: 'The Ring Goes South' },
		{ id: 'fotr-journey-in-the-dark',     name: 'Journey in the Dark' },
		{ id: 'fotr-breaking-of-the-fellowship', name: 'Breaking of the Fellowship' },
	],

	'two-towers-saga': [
		{ id: 'tts-the-uruk-hai',             name: 'The Uruk-hai' },
		{ id: 'tts-helms-deep',               name: "Helm's Deep" },
		{ id: 'tts-the-road-to-isengard',     name: 'The Road to Isengard' },
		{ id: 'tts-the-passage-of-the-marshes', name: 'The Passage of the Marshes' },
		{ id: 'tts-journey-to-the-cross-roads', name: 'Journey to the Cross-roads' },
		{ id: 'tts-shelobs-lair',             name: "Shelob's Lair" },
	],

	'return-of-the-king-saga': [
		{ id: 'rotk-cirith-ungol',            name: 'Cirith Ungol' },
		{ id: 'rotk-the-siege-of-gondor',     name: 'The Siege of Gondor' },
		{ id: 'rotk-the-battle-of-pelennor-fields', name: 'The Battle of the Pelennor Fields' },
		{ id: 'rotk-the-last-debate',         name: 'The Last Debate' },
		{ id: 'rotk-the-black-gate-opens',    name: 'The Black Gate Opens' },
		{ id: 'rotk-mount-doom',              name: 'Mount Doom' },
	],

	'dark-of-mirkwood': [
		{
			id: 'dom-the-oath',
			name: 'The Oath',
			campaignLog: [
				{ id: 'guilty-conscience', label: 'Guilty Conscience burden added (6+ resource tokens)', type: 'checkbox' },
			],
		},
		{
			id: 'dom-the-caves-of-nibin-dum',
			name: 'The Caves of Nibin-dûm',
			campaignLog: [
				{ id: 'ranger-sense-earned', label: 'Ranger Sense earned (final threat under 40)', type: 'checkbox' },
			],
		},
	],
};
