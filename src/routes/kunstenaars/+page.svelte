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

<div class="shell pt-10 md:pt-14">
	<h1 class="border-b border-hairline pb-6 type-h1">{t('artist.indexTitle')}</h1>

	<ul class="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
		{#each entries as { artist, count, image }, i (artist.slug)}
			<li class="group relative">
				{#if image}
					<div class="flex h-56 items-end">
						<img
							src={image.thumb}
							width={image.width}
							height={image.height}
							alt=""
							loading={i < 3 ? 'eager' : 'lazy'}
							decoding="async"
							class="block h-auto max-h-full w-auto max-w-full transition-[filter] duration-200 group-hover:brightness-[1.06]"
						/>
					</div>
				{/if}
				<div class="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
					<h2
						class="type-h2 decoration-1 underline-offset-[6px] group-focus-within:underline group-hover:underline"
					>
						{artist.name}
					</h2>
					<span class="type-small whitespace-nowrap text-aluminium tabular-nums">
						{plural(count, 'home.worksCountOne', 'home.worksCount')}
					</span>
				</div>
				{#if artist.basedIn}
					<p class="mt-1 type-small text-aluminium">
						{t('artist.basedIn', { place: artist.basedIn })}
					</p>
				{/if}
				{#if artist.isDemo}
					<DemoBadge kind="artist" class="mt-3" />
				{/if}
				<!-- One link over the whole entry; the name stays the accessible label. -->
				<a
					href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
					class="absolute inset-0 z-10"
					aria-label={artist.name}
				></a>
			</li>
		{/each}
	</ul>
</div>
