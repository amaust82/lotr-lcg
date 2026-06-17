export type Sphere = 'Leadership' | 'Tactics' | 'Spirit' | 'Lore' | 'Baggins' | 'Fellowship' | 'Neutral';

export interface HeroCard {
	name: string;
	productId: string;
	sphere: Sphere;
	traits: string;
}

export const heroes: HeroCard[] = [
	// Revised Core Set
	{ name: 'Aragorn',   productId: 'revised-core-set', sphere: 'Leadership', traits: 'Dúnedain. Noble. Ranger.' },
	{ name: 'Théodred', productId: 'revised-core-set', sphere: 'Leadership', traits: 'Noble. Rohan. Warrior.' },
	{ name: 'Glóin',    productId: 'revised-core-set', sphere: 'Leadership', traits: 'Dwarf. Noble.' },
	{ name: 'Gimli',    productId: 'revised-core-set', sphere: 'Tactics',    traits: 'Dwarf. Noble. Warrior.' },
	{ name: 'Legolas',  productId: 'revised-core-set', sphere: 'Tactics',    traits: 'Noble. Silvan. Warrior.' },
	{ name: 'Thalin',   productId: 'revised-core-set', sphere: 'Tactics',    traits: 'Dwarf. Warrior.' },
	{ name: 'Éowyn',    productId: 'revised-core-set', sphere: 'Spirit',     traits: 'Noble. Rohan.' },
	{ name: 'Eleanor',  productId: 'revised-core-set', sphere: 'Spirit',     traits: 'Gondor. Noble.' },
	{ name: 'Dúnhere', productId: 'revised-core-set', sphere: 'Spirit',     traits: 'Rohan. Warrior.' },
	{ name: 'Denethor', productId: 'revised-core-set', sphere: 'Lore',       traits: 'Gondor. Noble. Steward.' },
	{ name: 'Glorfindel', productId: 'revised-core-set', sphere: 'Lore',     traits: 'Noble. Noldor. Warrior.' },
	{ name: 'Beravor',  productId: 'revised-core-set', sphere: 'Lore',       traits: 'Dúnedain. Ranger.' },

	// Angmar Awakened Hero Expansion
	{ name: 'Aragorn',        productId: 'angmar-awakened-hero', sphere: 'Tactics',    traits: 'Dúnedain. Ranger. Warrior.' },
	{ name: 'Halbarad',       productId: 'angmar-awakened-hero', sphere: 'Leadership', traits: 'Dúnedain. Ranger.' },
	{ name: 'Merry',          productId: 'angmar-awakened-hero', sphere: 'Spirit',     traits: 'Hobbit.' },
	{ name: 'Dori',           productId: 'angmar-awakened-hero', sphere: 'Tactics',    traits: 'Dwarf.' },
	{ name: 'Erestor',        productId: 'angmar-awakened-hero', sphere: 'Lore',       traits: 'Noldor.' },
	{ name: 'Amarthiúl',     productId: 'angmar-awakened-hero', sphere: 'Leadership', traits: 'Dúnedain. Ranger. Warrior.' },
	{ name: 'Arwen Undómiel', productId: 'angmar-awakened-hero', sphere: 'Spirit',     traits: 'Noldor. Noble.' },

	// Dream-chaser Hero Expansion
	{ name: 'Círdan the Shipwright', productId: 'dream-chaser-hero', sphere: 'Spirit',     traits: 'Noldor. Noble.' },
	{ name: 'Galdor of the Havens', productId: 'dream-chaser-hero', sphere: 'Lore',       traits: 'Noldor.' },
	{ name: 'Denethor',             productId: 'dream-chaser-hero', sphere: 'Leadership', traits: 'Gondor. Noble. Steward.' },
	{ name: 'Lanwyn',               productId: 'dream-chaser-hero', sphere: 'Spirit',     traits: 'Dale. Scout.' },
	{ name: 'Argalad',              productId: 'dream-chaser-hero', sphere: 'Lore',       traits: 'Silvan. Scout.' },
	{ name: 'Na’asiyah',       productId: 'dream-chaser-hero', sphere: 'Tactics',    traits: 'Corsair. Warrior.' },
	{ name: 'Prince Imrahil',       productId: 'dream-chaser-hero', sphere: 'Tactics',    traits: 'Gondor. Noble. Warrior.' },

	// Ered Mithrin Hero Expansion
	{ name: 'Brand son of Bain',    productId: 'ered-mithrin-hero', sphere: 'Leadership', traits: 'Dale. Noble.' },
	{ name: 'Bard son of Brand',    productId: 'ered-mithrin-hero', sphere: 'Spirit',     traits: 'Dale. Noble.' },
	{ name: 'Grimbeorn the Old',    productId: 'ered-mithrin-hero', sphere: 'Tactics',    traits: 'Beorning. Warrior.' },
	{ name: 'Haldan',               productId: 'ered-mithrin-hero', sphere: 'Lore',       traits: 'Woodman. Scout.' },
	{ name: 'Dáin Ironfoot',       productId: 'ered-mithrin-hero', sphere: 'Spirit',     traits: 'Dwarf. Noble. Warrior.' },
	{ name: 'Bilbo Baggins',        productId: 'ered-mithrin-hero', sphere: 'Tactics',    traits: 'Hobbit. Burglar.' },
	{ name: 'Radagast',             productId: 'ered-mithrin-hero', sphere: 'Lore',       traits: 'Istari.' },

	// Defenders of Gondor
	{ name: 'Boromir',        productId: 'defenders-of-gondor', sphere: 'Leadership', traits: 'Gondor. Noble. Warrior.' },
	{ name: 'Prince Imrahil', productId: 'defenders-of-gondor', sphere: 'Leadership', traits: 'Gondor. Noble.' },
	{ name: 'Mablung',        productId: 'defenders-of-gondor', sphere: 'Tactics',    traits: 'Gondor. Ranger.' },
	{ name: 'Beregond',       productId: 'defenders-of-gondor', sphere: 'Tactics',    traits: 'Gondor. Warrior.' },
	{ name: 'Faramir',        productId: 'defenders-of-gondor', sphere: 'Lore',       traits: 'Gondor. Ranger. Noble.' },

	// Dwarves of Durin
	{ name: 'Dáin Ironfoot', productId: 'dwarves-of-durin', sphere: 'Leadership', traits: 'Dwarf. Noble.' },
	{ name: 'Ori',            productId: 'dwarves-of-durin', sphere: 'Lore',       traits: 'Dwarf.' },
	{ name: 'Bifur',          productId: 'dwarves-of-durin', sphere: 'Lore',       traits: 'Dwarf.' },
	{ name: 'Nori',           productId: 'dwarves-of-durin', sphere: 'Spirit',     traits: 'Dwarf.' },

	// Elves of Lórien
	{ name: 'Celeborn',        productId: 'elves-of-lorien', sphere: 'Leadership', traits: 'Silvan. Noble.' },
	{ name: 'Galadriel',       productId: 'elves-of-lorien', sphere: 'Spirit',     traits: 'Noldor. Noble.' },
	{ name: 'Haldir of Lórien', productId: 'elves-of-lorien', sphere: 'Lore',      traits: 'Silvan. Ranger. Scout.' },
	{ name: 'Elrond',          productId: 'elves-of-lorien', sphere: 'Lore',       traits: 'Noldor. Noble.' },

	// Riders of Rohan
	{ name: 'Éomer',    productId: 'riders-of-rohan', sphere: 'Tactics', traits: 'Rohan. Noble. Warrior.' },
	{ name: 'Hirgon',   productId: 'riders-of-rohan', sphere: 'Tactics', traits: 'Gondor. Scout.' },
	{ name: 'Lothíriel', productId: 'riders-of-rohan', sphere: 'Spirit', traits: 'Gondor. Noble.' },
	{ name: 'Fastred',  productId: 'riders-of-rohan', sphere: 'Spirit',  traits: 'Rohan. Warrior.' },

	// The Fellowship of the Ring (Saga)
	{ name: 'Frodo Baggins', productId: 'fellowship-of-the-ring-saga', sphere: 'Fellowship', traits: 'Hobbit. Ring-bearer.' },
	{ name: 'Sam Gamgee',    productId: 'fellowship-of-the-ring-saga', sphere: 'Leadership', traits: 'Hobbit.' },
	{ name: 'Merry',         productId: 'fellowship-of-the-ring-saga', sphere: 'Tactics',    traits: 'Hobbit.' },
	{ name: 'Pippin',        productId: 'fellowship-of-the-ring-saga', sphere: 'Lore',       traits: 'Hobbit.' },
	{ name: 'Fatty Bolger',  productId: 'fellowship-of-the-ring-saga', sphere: 'Spirit',     traits: 'Hobbit.' },
	{ name: 'Gandalf',       productId: 'fellowship-of-the-ring-saga', sphere: 'Neutral',    traits: 'Istari.' },

	// The Two Towers (Saga)
	{ name: 'Aragorn',  productId: 'two-towers-saga', sphere: 'Fellowship', traits: 'Dúnedain. Noble. Ranger.' },
	{ name: 'Théoden',  productId: 'two-towers-saga', sphere: 'Spirit',     traits: 'Rohan. Noble. Warrior.' },
	{ name: 'Treebeard', productId: 'two-towers-saga', sphere: 'Lore',      traits: 'Ent.' },
	{ name: 'Faramir',  productId: 'two-towers-saga', sphere: 'Leadership', traits: 'Gondor. Noble. Ranger.' },
	{ name: 'Damrod',   productId: 'two-towers-saga', sphere: 'Lore',       traits: 'Gondor. Ranger.' },

	// The Return of the King (Saga)
	{ name: 'Éowyn',      productId: 'return-of-the-king-saga', sphere: 'Tactics',    traits: 'Rohan. Noble.' },
	{ name: 'Beregond',   productId: 'return-of-the-king-saga', sphere: 'Spirit',     traits: 'Gondor. Warrior.' },
	{ name: 'Éomer',      productId: 'return-of-the-king-saga', sphere: 'Leadership', traits: 'Rohan. Noble. Warrior.' },
	{ name: 'Tom Cotton', productId: 'return-of-the-king-saga', sphere: 'Tactics',    traits: 'Hobbit.' },
];
