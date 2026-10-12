<!-- Artist page (docs/04 section 4). -->
<script lang="ts">
	import { t } from '#lib/i18n/index.js';
	import { config } from '#lib/config.js';
	import { getMainImage, getWorksByArtist } from '#lib/data/artworks.js';
	import { imageSize } from '#lib/utils/layout.js';
	import SpotlightFrame from '#lib/components/SpotlightFrame.svelte';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const artist = $derived(data.artist);
	const works = $derived(getWorksByArtist(artist.slug));

	/**
	 * No portrait yet, so never an empty frame: show a detail of their first work instead.
	 * A supplied detail photo is used as is; otherwise the main image is cropped in CSS.
	 */
	const visual = $derived.by(() => {
		if (artist.portrait) return { image: artist.portrait, crop: false };
		const first = works[0];
		if (!first) return undefined;
		const detail = first.images.find((image) => image.role === 'detail');
		return detail ? { image: detail, crop: false } : { image: getMainImage(first), crop: true };
	});
</script>

<svelte:head>
	<title>{artist.name} — {config.brandName}</title>
	<meta name="description" content={artist.shortBio} />
</svelte:head>

<div class="shell pt-10 md:pt-14">
	<header class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
		<div>
			<div class="flex flex-wrap items-center gap-x-4 gap-y-3">
				<h1 class="type-h1">{artist.name}</h1>
				{#if artist.isDemo}
					<DemoBadge kind="artist" />
				{/if}
			</div>
			{#if artist.basedIn}
				<p class="mt-3 text-aluminium">{t('artist.basedIn', { place: artist.basedIn })}</p>
			{/if}
			<div class="mt-8 max-w-[65ch] space-y-4">
				{#each artist.bio as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
			</div>
		</div>

		{#if visual}
			<SpotlightFrame class="aspect-4/5 max-h-[70vh] lg:aspect-square">
				{#if visual.crop}
					<!-- A tight crop of the work, presented like a detail photograph -->
					<div class="aspect-4/5 h-[min(52vh,440px)] overflow-hidden">
						<img
							src={visual.image.src}
							width={visual.image.width}
							height={visual.image.height}
							alt={visual.image.alt}
							decoding="async"
							class="size-full scale-[1.6] object-cover"
						/>
					</div>
				{:else}
					<div class="@container flex w-full justify-center">
						<img
							src={visual.image.src}
							width={visual.image.width}
							height={visual.image.height}
							alt={visual.image.alt}
							decoding="async"
							class="block"
							style={imageSize(visual.image, '100cqw', '52vh')}
						/>
					</div>
				{/if}
			</SpotlightFrame>
		{/if}
	</header>

	<section class="mt-section" aria-labelledby="works-title">
		<h2 id="works-title" class="mb-10 type-h2">
			{t('artist.worksBy', { name: artist.name })}
			<span class="text-aluminium tabular-nums">({works.length})</span>
		</h2>
		<ul
			class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4"
		>
			{#each works as artwork, i (artwork.id)}
				<li>
					<ArtworkTile
						{artwork}
						loading={i < 4 ? 'eager' : 'lazy'}
						eyeLine="[--tile-h:260px] sm:[--tile-h:260px] xl:[--tile-h:300px]"
					/>
				</li>
			{/each}
		</ul>
	</section>
</div>
