import { error } from '@sveltejs/kit';
import { artworks, getArtwork } from '#lib/data/artworks.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => artworks.map((artwork) => ({ slug: artwork.slug }));

export const load: PageLoad = ({ params }) => {
	const artwork = getArtwork(params.slug);
	if (!artwork) error(404);
	return { artwork };
};
