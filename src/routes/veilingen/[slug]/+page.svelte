<!-- Auction lot (docs/04 section 6): the Catawiki-style page with the full bid box. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t, tList } from '#lib/i18n/index.js';
	import { config } from '#lib/config.js';
	import { getArtist } from '#lib/data/artists.js';
	import { getBidCount } from '#lib/data/auction-state.svelte.js';
	import { formatLotNumber } from '#lib/utils/format.js';
	import Gallery from '#lib/components/Gallery.svelte';
	import BidBox from '#lib/components/BidBox.svelte';
	import BidHistory from '#lib/components/BidHistory.svelte';
	import ArtworkInfo from '#lib/components/ArtworkInfo.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lot = $derived(data.lot);
	const artwork = $derived(data.artwork);
	const artist = $derived(getArtist(artwork.artistSlug));
	const lotLabel = $derived(t('auction.lot', { n: formatLotNumber(lot.lotNumber) }));
</script>

<svelte:head>
	<title>{lotLabel}: {artwork.title}, {artist?.name} — {config.brandName}</title>
	<meta name="description" content={artwork.description} />
	<link rel="preload" as="image" href={artwork.images[0].src} fetchpriority="high" />
</svelte:head>

<div class="shell pt-6 md:pt-10">
	<nav aria-label={t('artwork.breadcrumbLabel')} class="mb-6 type-small text-aluminium">
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
			<li>
				<a href={resolve('/veilingen')} class="hover:text-paper hover:underline">
					{t('auction.indexTitle')}
				</a>
			</li>
			<li aria-hidden="true">/</li>
			<li aria-current="page" class="text-paper">{lotLabel}</li>
		</ol>
	</nav>

	<div class="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
		{#key artwork.id}
			<Gallery images={artwork.images} isDemo={artwork.isDemo} />
		{/key}

		<div class="self-start lg:sticky lg:top-28">
			{#if artist}
				<a
					href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
					class="font-semibold decoration-1 underline-offset-4 hover:underline"
				>
					{artist.name}
				</a>
			{/if}
			<h1 class="mt-1 type-h1">{artwork.title}</h1>
			<p class="mt-2 text-aluminium tabular-nums">{artwork.year}</p>
			{#if artwork.isDemo}
				<DemoBadge class="mt-4" />
			{/if}
			<div class="mt-8">
				{#key lot.slug}
					<BidBox {lot} />
				{/key}
			</div>
		</div>
	</div>

	{#if getBidCount(lot) > 0}
		<section id="history" class="mt-section scroll-mt-28" aria-labelledby="history-title">
			<h2 id="history-title" class="mb-5 type-h2">{t('auction.history')}</h2>
			<div class="max-w-2xl">
				<BidHistory {lot} />
			</div>
		</section>
	{/if}

	<ArtworkInfo {artwork} />

	<!-- Hoe werkt bieden? A real sequence, so numbers are appropriate here (docs/02). -->
	<section class="mt-section" aria-labelledby="how-title">
		<h2 id="how-title" class="type-h2">{t('auction.howTitle')}</h2>
		<ol class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each tList('auction.howSteps') as step, i (i)}
				<li class="border-t border-hairline pt-5">
					<span class="type-h2 text-aluminium tabular-nums" aria-hidden="true">{i + 1}</span>
					<p class="mt-3 max-w-[40ch]">{step}</p>
				</li>
			{/each}
		</ol>
	</section>
</div>
