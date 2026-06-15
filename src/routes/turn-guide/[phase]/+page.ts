import { PHASES } from '$lib/data/phases.js';

export const prerender = true;

export function entries() {
  return PHASES.map(p => ({ phase: p.slug }));
}
