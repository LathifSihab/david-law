<!-- Favourites: the works saved with the heart button in this session. Nothing is stored. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '#lib/i18n/index.js';
	import { artworks } from '#lib/data/artworks.js';
	import { favourites } from '#lib/data/favourites.svelte.js';
	import { CARD_GRID } from '#lib/utils/layout.js';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';
	import Button from '#lib/components/Button.svelte';

	const saved = $derived(artworks.filter((w) => favourites.has(w.id)));
</script>

<svelte:head>
	<title>{t('meta.favouritesTitle')}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="shell pt-8 md:pt-12">
	<h1 class="type-h1">{t('favourites.title')}</h1>
	<p class="mt-2 max-w-measure text-muted">{t('favourites.intro')}</p>

	{#if saved.length}
		<ul class="mt-8 {CARD_GRID}">
			{#each saved as artwork (artwork.id)}
				<li><ArtworkTile {artwork} headingLevel="h2" /></li>
			{/each}
		</ul>
	{:else}
		<div class="mt-8 rounded-card bg-surface p-8 text-center ring-1 ring-line ring-inset md:p-14">
			<p class="mx-auto max-w-[44ch] text-muted">{t('favourites.empty')}</p>
			<Button href={resolve('/collectie')} class="mt-6">{t('home.viewCollection')}</Button>
		</div>
	{/if}
</div>
