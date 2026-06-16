export interface Scenario {
	id: string;
	name: string;
}

export const campaigns: Record<string, Scenario[]> = {
	'revised-core-set': [
		{ id: 'rcs-passage-through-mirkwood', name: 'Passage Through Mirkwood' },
		{ id: 'rcs-journey-along-the-anduin', name: 'Journey Along the Anduin' },
		{ id: 'rcs-escape-from-dol-guldur',   name: 'Escape from Dol Guldur' },
	],

	'angmar-awakened-campaign': [
		{ id: 'aac-wastes-of-eriador',        name: 'The Wastes of Eriador' },
		{ id: 'aac-escape-from-mount-gram',   name: 'Escape from Mount Gram' },
		{ id: 'aac-across-the-ettenmoors',    name: 'Across the Ettenmoors' },
		{ id: 'aac-treachery-of-rhudaur',     name: 'The Treachery of Rhudaur' },
		{ id: 'aac-battle-of-carn-dum',       name: 'The Battle of Carn Dûm' },
		{ id: 'aac-dread-realm',              name: 'The Dread Realm' },
	],

	'dream-chaser-campaign': [
		{ id: 'dcc-voyage-across-belegaer',   name: 'Voyage Across Belegaer' },
		{ id: 'dcc-fate-of-numenor',          name: 'The Fate of Númenor' },
		{ id: 'dcc-raid-on-the-grey-havens',  name: 'Raid on the Grey Havens' },
		{ id: 'dcc-weather-hills',            name: 'The Weather Hills' },
		{ id: 'dcc-deadmens-dike',            name: "Deadmen's Dike" },
		{ id: 'dcc-wastes-of-eriador',        name: 'The Wastes of Eriador' },
		{ id: 'dcc-escape-from-umbar',        name: 'Escape from Umbar' },
		{ id: 'dcc-desert-crossing',          name: 'Desert Crossing' },
		{ id: 'dcc-long-arm-of-mordor',       name: 'The Long Arm of Mordor' },
	],

	'ered-mithrin-campaign': [
		{ id: 'emc-wilds-of-rhovanion',       name: 'The Wilds of Rhovanion' },
		{ id: 'emc-shadow-of-mirkwood',       name: 'A Shadow of the Past' },
		{ id: 'emc-dungeons-of-cirith-gurat', name: 'Dungeons of Cirith Gurat' },
		{ id: 'emc-corrupted-carrock',        name: 'The Corrupted Carrock' },
		{ id: 'emc-city-of-dale',             name: 'City of Dale' },
		{ id: 'emc-vengeance-of-mordor',      name: 'Vengeance of Mordor' },
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
};
