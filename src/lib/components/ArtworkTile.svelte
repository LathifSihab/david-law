<!--
	A marketplace card: the artwork uncropped in a square well, a favourite heart, the auction
	countdown as a chip, then artist, title, short specs and the price or current bid.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Artwork, AuctionLot } from '#lib/types.js';
	import { t, plural } from '#lib/i18n/index.js';
	import { getMainImage } from '#lib/data/artworks.js';
	import { getArtist } from '#lib/data/artists.js';
	import { getAuction } from '#lib/data/auctions.js';
	import {
		getBidCount,
		getCurrentBid,
		getEndsAt,
		getStartsAt
	} from '#lib/data/auction-state.svelte.js';
	import { formatDimensions, formatPrice } from '#lib/utils/format.js';
	import DemoBadge from './DemoBadge.svelte';
	import Countdown from './Countdown.svelte';
	import FavouriteButton from './FavouriteButton.svelte';

	interface Props {
		artwork: Artwork;
		/** The lot to link to. Defaults to the artwork's own auction, if it is in one. */
		lot?: AuctionLot;
		loading?: 'lazy' | 'eager';
		headingLevel?: 'h2' | 'h3' | 'p';
		class?: string;
	}

	let {
		artwork,
		lot: lotProp,
		loading = 'lazy',
		headingLevel = 'h3',
		class: className = ''
	}: Props = $props();

	const lot = $derived(
		lotProp ??
			(artwork.status === 'veiling' && artwork.auctionSlug
				? getAuction(artwork.auctionSlug)
				: undefined)
	);
	const image = $derived(getMainImage(artwork));
	const artist = $derived(getArtist(artwork.artistSlug));
	const href = $derived(
		lot
			? resolve('/veilingen/[slug]', { slug: lot.slug })
			: resolve('/collectie/[slug]', { slug: artwork.slug })
	);

	/** Label and amount for the bottom line; `live` colours it as a running auction. */
	const price = $derived.by((): { label?: string; text: string; live: boolean } => {
		if (lot) {
			const bid = getCurrentBid(lot);
			return {
				label: bid !== undefined ? t('auction.currentBid') : t('auction.startingBid'),
				text: formatPrice(bid ?? lot.startingBidEur),
				live: lot.state === 'live'
			};
		}
		if (artwork.status === 'verkocht') return { text: t('artwork.sold'), live: false };
		if (artwork.priceEur === undefined || artwork.status === 'op-aanvraag') {
			return { text: t('artwork.priceOnRequest'), live: false };
		}
		return { label: t('home.promoBuyTitle'), text: formatPrice(artwork.priceEur), live: false };
	});
</script>

<article
	class="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-canvas transition-shadow duration-200 hover:shadow-raised {className}"
>
	<div class="relative aspect-square bg-well">
		<div class="absolute inset-0 flex items-center justify-center p-[9%]">
			<img
				src={image.thumb}
				width={image.width}
				height={image.height}
				alt={image.alt}
				{loading}
				decoding="async"
				class="block max-h-full w-auto max-w-full object-contain shadow-[0_6px_18px_-6px_rgb(16_18_24/0.35)] transition-transform duration-300 group-hover:scale-[1.03]"
				class:opacity-60={artwork.status === 'verkocht'}
				style="aspect-ratio: {image.width} / {image.height}; height: auto"
			/>
		</div>

		<div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
			{#if artwork.isDemo}
				<DemoBadge />
			{/if}
			{#if artwork.status === 'verkocht'}
				<span
					class="rounded-full bg-ink px-2.5 py-0.5 text-xs leading-tight font-semibold text-canvas"
				>
					{t('artwork.sold')}
				</span>
			{/if}
		</div>

		{#if lot?.state === 'live'}
			<p
				class="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold shadow-card"
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					class="text-live"
					aria-hidden="true"
				>
					<circle cx="8" cy="8.5" r="5.75" /><path d="M8 5.5v3l2 1.5" stroke-linecap="round" />
				</svg>
				<span class="sr-only">{t('auction.closesIn')}</span>
				<Countdown endsAt={getEndsAt(lot)} />
			</p>
		{:else if lot?.state === 'binnenkort'}
			{@const startsAt = getStartsAt(lot)}
			{#if startsAt}
				<p
					class="absolute bottom-3 left-3 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold shadow-card"
				>
					<Countdown
						endsAt={startsAt}
						live={false}
						template={(time) => t('auction.startsIn', { time })}
					/>
				</p>
			{/if}
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-3 sm:p-4">
		<p class="truncate type-small text-muted">{artist?.name}</p>
		<svelte:element
			this={headingLevel}
			class="mt-0.5 line-clamp-2 font-semibold text-ink decoration-1 underline-offset-2 group-hover:underline"
		>
			{artwork.title}
		</svelte:element>
		<p class="mt-1 hidden truncate type-small text-muted sm:block">
			{artwork.technique}, {formatDimensions(artwork)}
		</p>

		<div class="mt-auto pt-3">
			{#if price.label}
				<p class="text-xs text-muted">{price.label}</p>
			{/if}
			<p class="type-price" class:text-live={price.live}>{price.text}</p>
			{#if lot && getBidCount(lot) > 0}
				<p class="text-xs text-muted tabular-nums">
					{plural(getBidCount(lot), 'auction.bidsCountOne', 'auction.bidsCount')}
				</p>
			{/if}
		</div>
	</div>

	<!-- One link covering the whole card; the heart sits above it. -->
	<a {href} class="absolute inset-0 z-10 rounded-card" aria-label="{artwork.title}, {artist?.name}"
	></a>
	<FavouriteButton id={artwork.id} title={artwork.title} class="absolute top-2.5 right-2.5 z-20" />
</article>
