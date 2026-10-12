<!-- Artist page (docs/04 section 4). -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t, plural } from '#lib/i18n/index.js';
	import { config } from '#lib/config.js';
	import { getMainImage, getWorksByArtist } from '#lib/data/artworks.js';
	import { CARD_GRID, imageSize } from '#lib/utils/layout.js';
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

<div class="shell pt-6 md:pt-10">
	<nav aria-label={t('artwork.breadcrumbLabel')} class="mb-5 type-small text-muted">
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
			<li>
				<a
					href={resolve('/kunstenaars')}
					class="-my-3 inline-block py-3 hover:text-brand hover:underline"
					>{t('artist.indexTitle')}</a
				>
			</li>
			<li aria-hidden="true">/</li>
			<li aria-current="page" class="text-ink">{artist.name}</li>
		</ol>
	</nav>

	<header
		class="grid overflow-hidden rounded-card border border-line lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
	>
		<div class="p-6 sm:p-8 lg:p-10">
			<div class="flex flex-wrap items-center gap-x-4 gap-y-3">
				<h1 class="type-h1">{artist.name}</h1>
				{#if artist.isDemo}
					<DemoBadge kind="artist" />
				{/if}
			</div>
			<p class="mt-2 flex flex-wrap gap-x-5 gap-y-1">
				{#if artist.basedIn}
					<span class="text-muted">{t('artist.basedIn', { place: artist.basedIn })}</span>
				{/if}
				<span class="font-semibold text-brand tabular-nums">
					{plural(works.length, 'home.worksCountOne', 'home.worksCount')}
				</span>
			</p>
			<div class="mt-6 max-w-[65ch] space-y-4">
				{#each artist.bio as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
			</div>
		</div>

		{#if visual}
			<SpotlightFrame class="rounded-none">
				{#if visual.crop}
					<!-- A tight crop of the work, presented like a detail photograph -->
					<div class="aspect-4/5 h-[min(48vh,400px)] overflow-hidden">
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
							style={imageSize(visual.image, '100cqw', '48vh')}
						/>
					</div>
				{/if}
			</SpotlightFrame>
		{/if}
	</header>

	<section class="mt-section" aria-labelledby="works-title">
		<h2 id="works-title" class="mb-6 type-h2">
			{t('artist.worksBy', { name: artist.name })}
			<span class="text-muted tabular-nums">({works.length})</span>
		</h2>
		<ul class={CARD_GRID}>
			{#each works as artwork, i (artwork.id)}
				<li>
					<ArtworkTile {artwork} loading={i < 4 ? 'eager' : 'lazy'} />
				</li>
			{/each}
		</ul>
	</section>
</div>
