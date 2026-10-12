/** A row of tiles: horizontal scroll-snap on small screens, a grid from `lg` (add lg:grid-cols-N). */
export const TILE_ROW =
	'-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-6 overflow-x-auto px-gutter pb-4 lg:mx-0 lg:grid lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0';

export const TILE_ROW_ITEM =
	'w-[68vw] max-w-72 shrink-0 snap-start sm:w-[40vw] lg:w-auto lg:max-w-none';

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
