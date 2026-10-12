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
	import FavouriteButton from '#lib/components/FavouriteButton.svelte';
	import KeyFacts from '#lib/components/KeyFacts.svelte';
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
	<nav aria-label={t('artwork.breadcrumbLabel')} class="mb-6 type-small text-muted">
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
			<li>
				<a
					href={resolve('/veilingen')}
					class="-my-3 inline-block py-3 hover:text-brand hover:underline"
				>
					{t('auction.indexTitle')}
				</a>
			</li>
			<li aria-hidden="true">/</li>
			<li aria-current="page" class="text-ink">{lotLabel}</li>
		</ol>
	</nav>

	<div
		class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10"
	>
		{#key artwork.id}
			<Gallery images={artwork.images} isDemo={artwork.isDemo} />
		{/key}

		<div
			class="self-start rounded-card border border-line p-5 sm:p-6 lg:sticky lg:top-36 lg:p-7 lg:shadow-card"
		>
			{#if artist}
				<a
					href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
					class="-my-3 inline-block py-3 font-semibold text-brand decoration-1 underline-offset-4 hover:underline"
				>
					{artist.name}
				</a>
			{/if}
			<div class="mt-1 flex items-start justify-between gap-4">
				<h1 class="type-h1">{artwork.title}</h1>
				<FavouriteButton id={artwork.id} title={artwork.title} class="shrink-0 ring-1 ring-line" />
			</div>
			<p class="mt-2 text-muted">
				{artwork.madeIn ? `${artwork.madeIn}, ${artwork.year}` : artwork.year}
			</p>
			{#if artwork.isDemo}
				<DemoBadge class="mt-4" />
			{/if}
			<KeyFacts {artwork} />
			<div class="mt-6">
				{#key lot.slug}
					<BidBox {lot} />
				{/key}
			</div>
		</div>
	</div>

	{#if getBidCount(lot) > 0}
		<section id="history" class="mt-section scroll-mt-40" aria-labelledby="history-title">
			<h2 id="history-title" class="mb-5 type-h2">{t('auction.history')}</h2>
			<div class="max-w-2xl">
				<BidHistory {lot} />
			</div>
		</section>
	{/if}

	<ArtworkInfo {artwork} />

	<!-- Hoe werkt bieden? A real sequence, so numbers are appropriate here (docs/02). -->
	<section
		class="mt-section rounded-card bg-surface p-6 ring-1 ring-line ring-inset sm:p-8 lg:p-10"
		aria-labelledby="how-title"
	>
		<h2 id="how-title" class="type-h2">{t('auction.howTitle')}</h2>
		<ol class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each tList('auction.howSteps') as step, i (i)}
				<li>
					<span
						class="grid size-9 place-items-center rounded-full bg-brand font-bold text-canvas tabular-nums"
						aria-hidden="true">{i + 1}</span
					>
					<p class="mt-3 max-w-[40ch] text-muted">{step}</p>
				</li>
			{/each}
		</ol>
	</section>
</div>
