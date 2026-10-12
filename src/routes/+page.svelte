<!-- Home (docs/04 section 1). Sells the platform, not one artist. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t, tList, plural } from '#lib/i18n/index.js';
	import { artists } from '#lib/data/artists.js';
	import {
		artworks,
		getArtworkById,
		getFeatured,
		getMainImage,
		getWorksByArtist
	} from '#lib/data/artworks.js';
	import { getAuction, getLiveAuctions } from '#lib/data/auctions.js';
	import { getEndsAt } from '#lib/data/auction-state.svelte.js';
	import { TECHNIQUE_GROUPS, countByTechnique, surnameKey } from '#lib/utils/catalogue.js';
	import Button from '#lib/components/Button.svelte';
	import SpotlightFrame from '#lib/components/SpotlightFrame.svelte';
	import WallLabel from '#lib/components/WallLabel.svelte';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import SectionHeading from '#lib/components/SectionHeading.svelte';
	import { TILE_ROW, TILE_ROW_ITEM } from '#lib/utils/layout.js';

	// The first featured work is the featured lot in the hero; the rest form the Uitgelicht row.
	const [heroWork, ...featured] = getFeatured();
	const heroLot = getAuction(heroWork.auctionSlug ?? '');
	const heroImage = getMainImage(heroWork);
	const heroHref = heroLot
		? resolve('/veilingen/[slug]', { slug: heroLot.slug })
		: resolve('/collectie/[slug]', { slug: heroWork.slug });

	const closingSoon = getLiveAuctions().flatMap((lot) => {
		const artwork = getArtworkById(lot.artworkId);
		return artwork ? [{ lot, artwork }] : [];
	});

	const techniqueCounts = countByTechnique(artworks);

	// By surname, as a gallery would: no single artist leads the list.
	const artistList = [...artists]
		.sort((a, b) => surnameKey(a.name).localeCompare(surnameKey(b.name), 'nl'))
		.map((artist) => ({ artist, works: getWorksByArtist(artist.slug) }));

	let activeArtist = $state(artistList[0].artist.slug);
	const activeEntry = $derived(artistList.find((entry) => entry.artist.slug === activeArtist));
	const activeImage = $derived(activeEntry ? getMainImage(activeEntry.works[0]) : undefined);
</script>

<svelte:head>
	<title>{t('meta.homeTitle')}</title>
	<meta name="description" content={t('meta.homeDescription')} />
	<link rel="preload" as="image" href={heroImage.src} fetchpriority="high" />
</svelte:head>

<div class="space-y-section">
	<!-- Hero: the platform, with one featured lot under the spotlight -->
	<section
		class="shell grid items-center gap-10 pt-10 md:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
		aria-labelledby="hero-title"
	>
		<div class="hero-text">
			<h1 id="hero-title" class="max-w-[13ch] type-display text-balance">
				{t('brand.tagline')}
			</h1>
			<p class="mt-6 max-w-[46ch] text-aluminium">{t('home.heroIntro')}</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button href={resolve('/collectie')}>{t('home.viewCollection')}</Button>
				<Button href={resolve('/veilingen')} variant="secondary">{t('home.allAuctions')}</Button>
			</div>
		</div>

		<figure class="min-w-0">
			<a href={heroHref} tabindex="-1" aria-hidden="true" class="block">
				<SpotlightFrame lightsOn>
					<img
						src={heroImage.src}
						width={heroImage.width}
						height={heroImage.height}
						alt={heroImage.alt}
						fetchpriority="high"
						decoding="async"
						class="block h-auto max-h-[min(60vh,560px)] w-auto max-w-full"
					/>
				</SpotlightFrame>
			</a>
			<figcaption class="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
				<div>
					<p class="mb-2 flex items-center gap-2 type-small text-aluminium">
						{#if heroLot?.state === 'live'}
							<span class="size-2 rounded-full bg-live" aria-hidden="true"></span>
						{/if}
						{t('home.featuredLot')}
					</p>
					<WallLabel artwork={heroWork} headingLevel="h2" />
				</div>
				<div class="space-y-1 sm:text-right">
					{#if heroLot?.state === 'live'}
						<p class="type-small text-aluminium">
							{t('auction.closesIn')}
							<Countdown endsAt={getEndsAt(heroLot)} class="type-price" />
						</p>
					{/if}
					<a
						href={heroHref}
						class="inline-flex min-h-11 items-center text-paper underline decoration-1 underline-offset-4 hover:decoration-2"
					>
						{t('home.toAuction')}
					</a>
				</div>
			</figcaption>
		</figure>
	</section>

	<!-- Sluit binnenkort: every live lot, soonest first -->
	<section class="shell" aria-labelledby="closing-title">
		<SectionHeading
			id="closing-title"
			title={t('home.closingSoon')}
			href={resolve('/veilingen')}
			linkLabel={t('home.allAuctions')}
		/>
		<ul class="{TILE_ROW} lg:grid-cols-5">
			{#each closingSoon as { lot, artwork } (lot.slug)}
				<li class={TILE_ROW_ITEM}>
					<ArtworkTile {artwork} {lot} eyeLine="[--tile-h:220px] lg:[--tile-h:240px]" />
				</li>
			{/each}
		</ul>
	</section>

	<!-- Uitgelicht -->
	<section class="shell" aria-labelledby="featured-title">
		<SectionHeading
			id="featured-title"
			title={t('home.featured')}
			href={resolve('/collectie')}
			linkLabel={t('home.viewAll')}
		/>
		<ul class="{TILE_ROW} lg:grid-cols-4">
			{#each featured as artwork (artwork.id)}
				<li class={TILE_ROW_ITEM}>
					<ArtworkTile {artwork} eyeLine="[--tile-h:260px] lg:[--tile-h:320px]" />
				</li>
			{/each}
		</ul>
	</section>

	<!-- Ontdek per techniek -->
	<section class="shell" aria-labelledby="browse-title">
		<SectionHeading id="browse-title" title={t('home.browseTitle')} />
		<ul class="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each TECHNIQUE_GROUPS as group (group.key)}
				<li class="border-t border-hairline">
					<a
						href={resolve(`/collectie?techniek=${group.param}`)}
						class="group flex items-baseline justify-between gap-4 py-5"
					>
						<span class="type-h2 decoration-1 underline-offset-[6px] group-hover:underline">
							{t(`catalogue.technique.${group.key}`)}
						</span>
						<span class="type-small whitespace-nowrap text-aluminium tabular-nums">
							{plural(techniqueCounts[group.key], 'home.worksCountOne', 'home.worksCount')}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Over het platform -->
	<section class="shell grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16" aria-labelledby="about-title">
		<h2 id="about-title" class="type-h2">{t('home.aboutTitle')}</h2>
		<div class="max-w-[60ch] space-y-4 text-paper">
			{#each tList('home.about') as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</section>

	<!-- Kunstenaars -->
	<section class="shell" aria-labelledby="artists-title">
		<SectionHeading id="artists-title" title={t('home.artistsTitle')} />
		<div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
			<ul class="flex flex-wrap gap-x-10 gap-y-3">
				{#each artistList as { artist, works } (artist.slug)}
					<li>
						<a
							href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
							class="group inline-flex items-baseline gap-3 py-1"
							onmouseenter={() => (activeArtist = artist.slug)}
							onfocus={() => (activeArtist = artist.slug)}
						>
							<span
								class="type-h2 decoration-1 underline-offset-[6px] group-hover:underline group-focus-visible:underline"
							>
								{artist.name}
							</span>
							<span class="type-small whitespace-nowrap text-aluminium tabular-nums">
								{plural(works.length, 'home.worksCountOne', 'home.worksCount')}
							</span>
						</a>
					</li>
				{/each}
			</ul>

			<!-- Desktop only: a preview of the hovered artist's first work -->
			{#if activeEntry && activeImage}
				<div class="hidden lg:block" aria-hidden="true">
					<div class="relative inline-block">
						<img
							src={activeImage.thumb}
							width={activeImage.width}
							height={activeImage.height}
							alt=""
							loading="lazy"
							decoding="async"
							class="block h-auto max-h-80 w-auto max-w-full"
						/>
						{#if activeEntry.works[0].isDemo}
							<DemoBadge class="absolute top-2 left-2" />
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</section>
</div>

<style>
	/* "The lights come on": the spotlight fades in (900ms), then the text (400ms). */
	.hero-text {
		animation: lights-on 400ms var(--ease-gallery) 700ms both;
	}
</style>
