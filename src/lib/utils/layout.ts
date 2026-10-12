/** A row of tiles: horizontal scroll-snap on small screens, a grid from `lg` (add lg:grid-cols-N). */
export const TILE_ROW =
	'-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-6 overflow-x-auto px-gutter pb-4 lg:mx-0 lg:grid lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0';

export const TILE_ROW_ITEM =
	'w-[68vw] max-w-72 shrink-0 snap-start sm:w-[40vw] lg:w-auto lg:max-w-none';
