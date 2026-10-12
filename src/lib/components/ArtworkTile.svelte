<!--
	An artwork at its real aspect ratio, bottom-aligned on a shared eye line, with its wall label.
	Hover: the image brightens slightly and the artist name underlines. No lift, shadow or scale.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Artwork, AuctionLot } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import { getMainImage } from '#lib/data/artworks.js';
	import { getArtist } from '#lib/data/artists.js';
	import { getEndsAt } from '#lib/data/auction-state.svelte.js';
	import WallLabel from './WallLabel.svelte';
	import DemoBadge from './DemoBadge.svelte';
	import Countdown from './Countdown.svelte';

	interface Props {
		artwork: Artwork;
		/** When set, the tile links to the auction lot and shows its countdown. */
		lot?: AuctionLot;
		/** Height of the eye-line box, as a `--tile-h` value class, e.g. '[--tile-h:300px]'. */
		eyeLine?: string;
		loading?: 'lazy' | 'eager';
		headingLevel?: 'h2' | 'h3' | 'p';
		class?: string;
	}

	let {
		artwork,
		lot,
		eyeLine = '[--tile-h:260px] sm:[--tile-h:300px] xl:[--tile-h:340px]',
		loading = 'lazy',
		headingLevel = 'h3',
		class: className = ''
	}: Props = $props();

	const image = $derived(getMainImage(artwork));
	const artistName = $derived(getArtist(artwork.artistSlug)?.name ?? '');
	const href = $derived(
		lot
			? resolve('/veilingen/[slug]', { slug: lot.slug })
			: resolve('/collectie/[slug]', { slug: artwork.slug })
	);
</script>

<article class="group relative {className}">
	<div class="flex h-(--tile-h) items-end {eyeLine}">
		<div class="relative max-w-full">
			<img
				src={image.thumb}
				width={image.width}
				height={image.height}
				alt={image.alt}
				{loading}
				decoding="async"
				class="block h-auto max-h-(--tile-h) w-auto max-w-full transition-[filter] duration-200 group-hover:brightness-[1.06]"
				class:opacity-70={artwork.status === 'verkocht'}
			/>
			{#if artwork.isDemo}
				<DemoBadge class="absolute top-2 left-2" />
			{/if}
		</div>
	</div>

	<WallLabel {artwork} {headingLevel} class="mt-4" />

	{#if lot}
		<p class="mt-1 type-small text-aluminium">
			{t('auction.closesIn')}
			<Countdown endsAt={getEndsAt(lot)} />
		</p>
	{/if}

	<!-- One link covering the whole tile; the label stays readable text for screen readers. -->
	<a {href} class="absolute inset-0 z-10" aria-label="{artwork.title}, {artistName}"></a>
</article>
