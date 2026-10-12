import { SvelteSet } from 'svelte/reactivity';

/**
 * Artwork ids the visitor saved with the heart button. Module state only: it survives client-side
 * navigation but not a reload, and nothing is stored (demo, docs/07).
 */
export const favourites = new SvelteSet<string>();

/** Toggles an artwork and returns whether it is now saved. */
export function toggleFavourite(id: string): boolean {
	if (favourites.has(id)) {
		favourites.delete(id);
		return false;
	}
	favourites.add(id);
	return true;
}
