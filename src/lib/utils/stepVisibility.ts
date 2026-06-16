import type { PhaseStep } from '$lib/data/phases';
import type { CollectionState } from '$lib/stores/collection';

export function isStepVisible(step: PhaseStep, collection: CollectionState): boolean {
	if (!step.product) return true;
	if (collection.showEverything) return true;
	return collection.products[step.product] === true;
}
