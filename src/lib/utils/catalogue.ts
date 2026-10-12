import type { Artwork, ArtworkStatus } from '#lib/types.js';
import { getArtist } from '#lib/data/artists.js';
import { getAuction } from '#lib/data/auctions.js';
import { getCurrentBid } from '#lib/data/auction-state.svelte.js';
import { LIMITS, parseAmount, sanitizeText } from '#lib/utils/input.js';

/*
 * Catalogue logic (docs/04 section 2): grouping, filtering, sorting and the URL format.
 * URL keys and values are Dutch so shared links read naturally:
 *   ?status=te-koop,veiling&kunstenaar=yuna-breckx&techniek=fotografie&formaat=groot
 *   &orientatie=staand&min=500&max=2000&sort=prijs-asc&q=getij
 */

/** Technique groups for browsing and filtering. `param` is the URL value. */
export const TECHNIQUE_GROUPS = [
	{ key: 'painting', param: 'schilderkunst' },
	{ key: 'photography', param: 'fotografie' },
	{ key: 'print', param: 'zeefdruk' },
	{ key: 'paper', param: 'papier' }
] as const;
export type TechniqueGroup = (typeof TECHNIQUE_GROUPS)[number]['key'];

export const STATUSES: readonly ArtworkStatus[] = ['te-koop', 'veiling', 'verkocht', 'op-aanvraag'];

/** By longest side: small < 50 cm, medium 50–99 cm, large from 100 cm. */
export const SIZE_GROUPS = [
	{ key: 'small', param: 'klein' },
	{ key: 'medium', param: 'middel' },
	{ key: 'large', param: 'groot' }
] as const;
export type SizeGroup = (typeof SIZE_GROUPS)[number]['key'];

export const ORIENTATIONS = [
	{ key: 'portrait', param: 'staand' },
	{ key: 'landscape', param: 'liggend' },
	{ key: 'square', param: 'vierkant' }
] as const;
export type Orientation = (typeof ORIENTATIONS)[number]['key'];

export const SORTS = [
	{ key: 'newest', param: 'nieuwste' },
	{ key: 'priceAsc', param: 'prijs-asc' },
	{ key: 'priceDesc', param: 'prijs-desc' },
	{ key: 'artist', param: 'kunstenaar' }
] as const;
export type SortKey = (typeof SORTS)[number]['key'];

export interface Filters {
	status: ArtworkStatus[];
	artist: string[]; // artist slugs
	technique: TechniqueGroup[];
	size: SizeGroup[];
	orientation: Orientation[];
	min?: number;
	max?: number;
	q: string;
	sort: SortKey;
}

export type FacetGroup = 'status' | 'artist' | 'technique' | 'size' | 'orientation' | 'price';

export const EMPTY_FILTERS: Filters = {
	status: [],
	artist: [],
	technique: [],
	size: [],
	orientation: [],
	q: '',
	sort: 'newest'
};

// ---------------------------------------------------------------- classification

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

export function getSizeGroup(artwork: Artwork): SizeGroup {
	const longest = Math.max(artwork.widthCm, artwork.heightCm);
	if (longest < 50) return 'small';
	if (longest < 100) return 'medium';
	return 'large';
}

/** Square when within 5% of 1:1. */
export function getOrientation(artwork: Artwork): Orientation {
	const ratio = artwork.widthCm / artwork.heightCm;
	if (Math.abs(ratio - 1) <= 0.05) return 'square';
	return ratio < 1 ? 'portrait' : 'landscape';
}

/** The price a buyer would compare: fixed price, else the current (or starting) auction bid. */
export function getEffectivePrice(artwork: Artwork): number | undefined {
	if (artwork.priceEur !== undefined && artwork.status !== 'op-aanvraag') return artwork.priceEur;
	const lot = artwork.auctionSlug ? getAuction(artwork.auctionSlug) : undefined;
	return lot ? (getCurrentBid(lot) ?? lot.startingBidEur) : undefined;
}

/** Sort key for artist names: by surname, as a gallery would ("Noor El Amrani" → "El Amrani"). */
export function surnameKey(name: string): string {
	return name.slice(name.indexOf(' ') + 1);
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

// ---------------------------------------------------------------- filtering and sorting

const normalise = (text: string) =>
	text
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

function matchesSearch(artwork: Artwork, q: string): boolean {
	if (!q) return true;
	const haystack = normalise(
		[
			artwork.title,
			getArtist(artwork.artistSlug)?.name ?? '',
			artwork.technique,
			artwork.support,
			artwork.series ?? ''
		].join(' ')
	);
	return normalise(q)
		.split(/\s+/)
		.filter(Boolean)
		.every((word) => haystack.includes(word));
}

/**
 * Works matching every filter. Pass `except` to ignore one group, which gives the facet counts
 * ("how many works would I get if I also ticked this box?").
 */
export function filterWorks(works: Artwork[], f: Filters, except?: FacetGroup): Artwork[] {
	const priceActive = f.min !== undefined || f.max !== undefined;
	return works.filter((work) => {
		if (except !== 'status' && f.status.length && !f.status.includes(work.status)) return false;
		if (except !== 'artist' && f.artist.length && !f.artist.includes(work.artistSlug)) return false;
		if (
			except !== 'technique' &&
			f.technique.length &&
			!f.technique.includes(getTechniqueGroup(work))
		)
			return false;
		if (except !== 'size' && f.size.length && !f.size.includes(getSizeGroup(work))) return false;
		if (
			except !== 'orientation' &&
			f.orientation.length &&
			!f.orientation.includes(getOrientation(work))
		)
			return false;
		if (except !== 'price' && priceActive) {
			const price = getEffectivePrice(work);
			if (price === undefined) return false;
			if (f.min !== undefined && price < f.min) return false;
			if (f.max !== undefined && price > f.max) return false;
		}
		return matchesSearch(work, f.q);
	});
}

export function sortWorks(works: Artwork[], sort: SortKey): Artwork[] {
	const byNewest = (a: Artwork, b: Artwork) =>
		b.addedAt.localeCompare(a.addedAt) || a.id.localeCompare(b.id);
	const sorted = [...works];
	switch (sort) {
		case 'priceAsc':
		case 'priceDesc': {
			const dir = sort === 'priceAsc' ? 1 : -1;
			// Works without a price ("op aanvraag") always go last.
			return sorted.sort((a, b) => {
				const pa = getEffectivePrice(a);
				const pb = getEffectivePrice(b);
				if (pa === undefined && pb === undefined) return byNewest(a, b);
				if (pa === undefined) return 1;
				if (pb === undefined) return -1;
				return (pa - pb) * dir || byNewest(a, b);
			});
		}
		case 'artist':
			return sorted.sort((a, b) => {
				const na = surnameKey(getArtist(a.artistSlug)?.name ?? '');
				const nb = surnameKey(getArtist(b.artistSlug)?.name ?? '');
				return na.localeCompare(nb, 'nl') || a.title.localeCompare(b.title, 'nl');
			});
		default:
			return sorted.sort(byNewest);
	}
}

/** Count of works per option for one facet, given every other active filter. */
export function facetCounts<K extends string>(
	works: Artwork[],
	f: Filters,
	group: FacetGroup,
	keyOf: (work: Artwork) => K
): Partial<Record<K, number>> {
	const counts: Partial<Record<K, number>> = {};
	for (const work of filterWorks(works, f, group)) {
		const key = keyOf(work);
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

export function activeFilterCount(f: Filters): number {
	return (
		f.status.length +
		f.artist.length +
		f.technique.length +
		f.size.length +
		f.orientation.length +
		(f.min !== undefined ? 1 : 0) +
		(f.max !== undefined ? 1 : 0)
	);
}

// ---------------------------------------------------------------- URL format

type Mapping<K extends string> = readonly { key: K; param: string }[];

function fromParams<K extends string>(raw: string | null, mapping: Mapping<K>): K[] {
	if (!raw) return [];
	const params = raw.split(',');
	return mapping.filter((m) => params.includes(m.param)).map((m) => m.key);
}

function toParam<K extends string>(keys: K[], mapping: Mapping<K>): string {
	return mapping
		.filter((m) => keys.includes(m.key))
		.map((m) => m.param)
		.join(',');
}

/** URL amounts are untrusted: strict digits with an optional 1–2 decimal part (no 1e3, 0x10, -5). */
const toNumber = (raw: string | null) => parseAmount(raw);

const STATUS_MAPPING: Mapping<ArtworkStatus> = STATUSES.map((s) => ({ key: s, param: s }));

export function parseFilters(params: Pick<URLSearchParams, 'get'>): Filters {
	return {
		status: fromParams(params.get('status'), STATUS_MAPPING),
		artist: (params.get('kunstenaar') ?? '').split(',').filter((slug) => getArtist(slug)),
		technique: fromParams(params.get('techniek'), TECHNIQUE_GROUPS),
		size: fromParams(params.get('formaat'), SIZE_GROUPS),
		orientation: fromParams(params.get('orientatie'), ORIENTATIONS),
		min: toNumber(params.get('min')),
		max: toNumber(params.get('max')),
		q: sanitizeText(params.get('q') ?? '', LIMITS.search),
		sort: fromParams(params.get('sort'), SORTS)[0] ?? 'newest'
	};
}

/** The query string for a filter state, without the leading "?". Empty values are left out. */
export function serializeFilters(f: Filters): string {
	const params = new URLSearchParams();
	const set = (key: string, value: string) => value && params.set(key, value);
	set('status', toParam(f.status, STATUS_MAPPING));
	set('kunstenaar', f.artist.join(','));
	set('techniek', toParam(f.technique, TECHNIQUE_GROUPS));
	set('formaat', toParam(f.size, SIZE_GROUPS));
	set('orientatie', toParam(f.orientation, ORIENTATIONS));
	if (f.min !== undefined) params.set('min', String(f.min));
	if (f.max !== undefined) params.set('max', String(f.max));
	set('q', f.q.trim());
	if (f.sort !== 'newest') set('sort', toParam([f.sort], SORTS));
	// Keep commas readable in shared links.
	return params.toString().replace(/%2C/g, ',');
}

// ---------------------------------------------------------------- related works

/**
 * Up to `limit` other works by the same artist. With fewer than 2, the row is filled with works
 * from the same technique group (docs/04), and `byArtist` is false so the heading can change.
 */
export function getRelatedWorks(
	artwork: Artwork,
	works: Artwork[],
	limit = 4
): { works: Artwork[]; byArtist: boolean } {
	const newestFirst = (a: Artwork, b: Artwork) => b.addedAt.localeCompare(a.addedAt);
	const sameArtist = works
		.filter((w) => w.artistSlug === artwork.artistSlug && w.id !== artwork.id)
		.sort(newestFirst);
	if (sameArtist.length >= 2) return { works: sameArtist.slice(0, limit), byArtist: true };

	const group = getTechniqueGroup(artwork);
	const fill = works
		.filter((w) => w.id !== artwork.id && !sameArtist.includes(w) && getTechniqueGroup(w) === group)
		.sort(newestFirst);
	return { works: [...sameArtist, ...fill].slice(0, limit), byArtist: false };
}
