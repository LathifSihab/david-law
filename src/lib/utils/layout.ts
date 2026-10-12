/** A row of tiles: horizontal scroll-snap on small screens, a grid from `lg` (add lg:grid-cols-N). */
export const TILE_ROW =
	'no-scrollbar -mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pt-1 pb-4 sm:gap-4 lg:mx-0 lg:grid lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0';

export const TILE_ROW_ITEM =
	'w-[44vw] max-w-64 shrink-0 snap-start sm:w-[30vw] lg:w-auto lg:max-w-none';

/** A responsive grid of cards: two columns on phones, up to four on wide screens. */
export const CARD_GRID = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4';

/**
 * Inline style giving an image an explicit width, so the browser reserves its space before it
 * loads (no layout shift): as wide as `available` allows (e.g. '100cqw' inside an @container),
 * never taller than `maxHeight`, and never upscaled beyond 1.25× its intrinsic size (docs/03
 * note on low-res files). The height follows from the aspect ratio.
 */
export function imageSize(
	image: { width: number; height: number },
	available: string,
	maxHeight: string
): string {
	const ratio = (image.width / image.height).toFixed(4);
	const cap = Math.round(image.width * 1.25);
	return `width: min(${available}, ${cap}px, calc(${maxHeight} * ${ratio})); height: auto; aspect-ratio: ${image.width} / ${image.height}`;
}
