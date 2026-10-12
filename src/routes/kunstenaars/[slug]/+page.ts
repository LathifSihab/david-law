import { error } from '@sveltejs/kit';
import { artists, getArtist } from '#lib/data/artists.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => artists.map((artist) => ({ slug: artist.slug }));

export const load: PageLoad = ({ params }) => {
	const artist = getArtist(params.slug);
	if (!artist) error(404);
	return { artist };
};
