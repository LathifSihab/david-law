import { error } from '@sveltejs/kit';
import { auctions, getAuction } from '#lib/data/auctions.js';
import { getArtworkById } from '#lib/data/artworks.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => auctions.map((lot) => ({ slug: lot.slug }));

export const load: PageLoad = ({ params }) => {
	const lot = getAuction(params.slug);
	const artwork = lot && getArtworkById(lot.artworkId);
	if (!lot || !artwork) error(404);
	return { lot, artwork };
};
