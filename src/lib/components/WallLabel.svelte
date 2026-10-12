<!--
	The museum wall label (docs/02): the one recurring device across the site.
	Artist, then title (italic) and year, then medium lines, then the price or auction state.
-->
<script lang="ts">
	import type { Artwork, Edition } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import { formatDimensions, formatPrice } from '#lib/utils/format.js';
	import { getArtist } from '#lib/data/artists.js';
	import { getAuction } from '#lib/data/auctions.js';
	import { getCurrentBid } from '#lib/data/auction-state.svelte.js';

	interface Props {
		artwork: Artwork;
		/** 'full' adds support, edition, signature and certificate lines. */
		variant?: 'tile' | 'full';
		showPrice?: boolean;
		/** Heading level for the title, so the label fits the page outline. */
		headingLevel?: 'h2' | 'h3' | 'p';
		class?: string;
	}

	let {
		artwork,
		variant = 'tile',
		showPrice = true,
		headingLevel = 'h3',
		class: className = ''
	}: Props = $props();

	const artist = $derived(getArtist(artwork.artistSlug));
	const lot = $derived(artwork.auctionSlug ? getAuction(artwork.auctionSlug) : undefined);

	function editionLine(edition: Edition): string {
		return edition.artistProofs
			? t('artwork.editionWithProofs', { size: edition.size, ap: edition.artistProofs })
			: t('artwork.editionSimple', { size: edition.size });
	}

	/** The price line, and whether it describes a running auction (amber). */
	const price = $derived.by((): { text: string; live: boolean } => {
		if (artwork.status === 'veiling' && lot) {
			const bid = getCurrentBid(lot);
			const live = lot.state === 'live';
			return bid !== undefined
				? { text: `${t('auction.currentBid')} ${formatPrice(bid)}`, live }
				: { text: `${t('auction.startingBid')} ${formatPrice(lot.startingBidEur)}`, live };
		}
		if (artwork.status === 'verkocht') return { text: t('artwork.sold'), live: false };
		if (artwork.priceEur === undefined || artwork.status === 'op-aanvraag') {
			return { text: t('artwork.priceOnRequest'), live: false };
		}
		return { text: formatPrice(artwork.priceEur), live: false };
	});
</script>

<div class="space-y-0.5 {className}">
	<!-- Underlines when the surrounding ArtworkTile (.group) is hovered or focused. -->
	<p
		class="font-semibold text-paper decoration-1 underline-offset-4 group-focus-within:underline group-hover:underline"
	>
		{artist?.name}
	</p>
	<svelte:element this={headingLevel} class="type-h3 text-paper">
		<i>{artwork.title}</i>, <span class="font-normal tabular-nums">{artwork.year}</span>
	</svelte:element>
	<p class="pt-1 type-small text-aluminium">
		{#if variant === 'full'}
			{artwork.technique}<br />
			{artwork.support}<br />
			{formatDimensions(artwork)}
		{:else}
			{artwork.technique}, {formatDimensions(artwork)}
		{/if}
		{#if artwork.edition}
			<br />{editionLine(artwork.edition)}
		{/if}
		{#if variant === 'full'}
			{#if artwork.signatureNote}<br />{artwork.signatureNote}{/if}
			{#if artwork.certificate}<br />{t('artwork.trust.certificate')}{/if}
		{/if}
	</p>
	{#if showPrice}
		<p class="pt-1.5 type-price" class:text-live={price.live}>{price.text}</p>
	{/if}
</div>
