<!-- Artists index (docs/04 section 4): every artist with a work count and one representative work. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t, plural } from '#lib/i18n/index.js';
	import { artists } from '#lib/data/artists.js';
	import { getMainImage, getWorksByArtist } from '#lib/data/artworks.js';
	import { surnameKey } from '#lib/utils/catalogue.js';
	import DemoBadge from '#lib/components/DemoBadge.svelte';

	// By surname, as on the home page. The representative work is a featured one if there is one.
	const entries = [...artists]
		.sort((a, b) => surnameKey(a.name).localeCompare(surnameKey(b.name), 'nl'))
		.map((artist) => {
			const works = getWorksByArtist(artist.slug);
			const representative = works.find((w) => w.featured) ?? works[0];
			return { artist, count: works.length, image: representative && getMainImage(representative) };
		});
</script>

<svelte:head>
	<title>{t('meta.artistsTitle')}</title>
	<meta name="description" content={t('brand.footerLine')} />
</svelte:head>

<div class="shell pt-8 md:pt-12">
	<h1 class="type-h1">{t('artist.indexTitle')}</h1>

	<ul class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
		{#each entries as { artist, count, image }, i (artist.slug)}
			<li
				class="group relative flex overflow-hidden rounded-card border border-line bg-canvas transition-shadow hover:shadow-raised"
			>
				<div class="flex w-2/5 shrink-0 items-center justify-center bg-well p-4">
					{#if image}
						<img
							src={image.thumb}
							width={image.width}
							height={image.height}
							alt=""
							loading={i < 6 ? 'eager' : 'lazy'}
							decoding="async"
							class="block max-h-40 w-auto max-w-full shadow-[0_6px_18px_-6px_rgb(16_18_24/0.35)]"
							style="aspect-ratio: {image.width} / {image.height}; height: auto"
						/>
					{/if}
				</div>
				<div class="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
					<h2 class="type-h3 decoration-1 underline-offset-4 group-hover:underline">
						{artist.name}
					</h2>
					{#if artist.basedIn}
						<p class="type-small text-muted">{t('artist.basedIn', { place: artist.basedIn })}</p>
					{/if}
					<p class="mt-2 line-clamp-3 type-small text-muted">{artist.shortBio}</p>
					<div class="mt-auto flex flex-wrap items-center gap-2 pt-3">
						<span class="type-small font-semibold text-brand tabular-nums">
							{plural(count, 'home.worksCountOne', 'home.worksCount')}
						</span>
						{#if artist.isDemo}
							<DemoBadge kind="artist" />
						{/if}
					</div>
				</div>
				<!-- One link over the whole card; the name stays the accessible label. -->
				<a
					href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
					class="absolute inset-0 z-10 rounded-card"
					aria-label={artist.name}
				></a>
			</li>
		{/each}
	</ul>
</div>
