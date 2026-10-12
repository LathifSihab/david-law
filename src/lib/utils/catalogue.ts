import type { Artwork } from '#lib/types.js';

/** Technique groups for browsing and filtering (docs/04). `param` is the URL value. */
export const TECHNIQUE_GROUPS = [
	{ key: 'painting', param: 'schilderkunst' },
	{ key: 'photography', param: 'fotografie' },
	{ key: 'print', param: 'zeefdruk' },
	{ key: 'paper', param: 'papier' }
] as const;

export type TechniqueGroup = (typeof TECHNIQUE_GROUPS)[number]['key'];

/** Maps the free-text technique/support fields to one group. Order matters: a screenprint is on paper too. */
export function getTechniqueGroup(artwork: Artwork): TechniqueGroup {
	const technique = artwork.technique.toLowerCase();
	const support = artwork.support.toLowerCase();
	if (technique.includes('fotogra')) return 'photography';
	if (technique.includes('zeefdruk') || technique.includes('grafiek')) return 'print';
	if (/olie|acryl|tempera|gouache/.test(technique) || /doek|paneel/.test(support))
		return 'painting';
	return 'paper';
}

export function countByTechnique(works: Artwork[]): Record<TechniqueGroup, number> {
	const counts: Record<TechniqueGroup, number> = {
		painting: 0,
		photography: 0,
		print: 0,
		paper: 0
	};
	for (const work of works) counts[getTechniqueGroup(work)]++;
	return counts;
}
