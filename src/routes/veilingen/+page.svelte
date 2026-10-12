<!-- Auctions overview (docs/04 section 5): Lopend (closing soonest first) and Binnenkort tabs. -->
<script lang="ts">
	import { t, tList } from '#lib/i18n/index.js';
	import type { AuctionLot } from '#lib/types.js';
	import { getArtworkById } from '#lib/data/artworks.js';
	import { getLiveAuctions, getUpcomingAuctions } from '#lib/data/auctions.js';
	import { CARD_GRID } from '#lib/utils/layout.js';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';

	const withArtwork = (lots: AuctionLot[]) =>
		lots.flatMap((lot) => {
			const artwork = getArtworkById(lot.artworkId);
			return artwork ? [{ lot, artwork }] : [];
		});

	const tabs = [
		{ id: 'lopend', label: t('auction.tabRunning'), lots: withArtwork(getLiveAuctions()) },
		{ id: 'binnenkort', label: t('auction.tabUpcoming'), lots: withArtwork(getUpcomingAuctions()) }
	];

	// ARIA tabs: arrow keys move between tabs, Tab moves into the panel.
	let active = $state(0);
	let tabButtons = $state<HTMLButtonElement[]>([]);

	function onTabKeydown(event: KeyboardEvent) {
		if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
		event.preventDefault();
		active = (active + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
		tabButtons[active]?.focus();
	}
</script>

<svelte:head>
	<title>{t('meta.auctionsTitle')}</title>
	<meta name="description" content={t('brand.footerLine')} />
</svelte:head>

<div class="shell pt-8 md:pt-12">
	<h1 class="type-h1">{t('auction.indexTitle')}</h1>
	<p class="mt-2 max-w-measure text-muted">{t('home.promoAuctionsText')}</p>

	<div
		role="tablist"
		aria-label={t('auction.indexTitle')}
		class="mt-6 inline-flex gap-1 rounded-full bg-surface p-1 ring-1 ring-line ring-inset"
	>
		{#each tabs as tab, i (tab.id)}
			<button
				bind:this={tabButtons[i]}
				type="button"
				role="tab"
				id="tab-{tab.id}"
				aria-selected={i === active}
				aria-controls="panel-{tab.id}"
				tabindex={i === active ? 0 : -1}
				class="min-h-10 rounded-full px-5 font-semibold text-muted hover:text-ink aria-selected:bg-canvas aria-selected:text-ink aria-selected:shadow-card"
				onclick={() => (active = i)}
				onkeydown={onTabKeydown}
			>
				{tab.label}
				<span class="tabular-nums">({tab.lots.length})</span>
			</button>
		{/each}
	</div>

	{#each tabs as tab, i (tab.id)}
		<div
			role="tabpanel"
			id="panel-{tab.id}"
			aria-labelledby="tab-{tab.id}"
			hidden={i !== active}
			tabindex="0"
			class="mt-8 rounded-card outline-none focus-visible:outline-2"
		>
			<ul class={CARD_GRID}>
				{#each tab.lots as { lot, artwork }, j (lot.slug)}
					<li>
						<ArtworkTile {artwork} {lot} headingLevel="h2" loading={j < 8 ? 'eager' : 'lazy'} />
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<!-- Hoe werkt bieden? -->
	<section
		class="mt-section rounded-card bg-surface p-6 ring-1 ring-line ring-inset sm:p-8 lg:p-10"
		aria-labelledby="how-title"
	>
		<h2 id="how-title" class="type-h2">{t('auction.howTitle')}</h2>
		<ol class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each tList('auction.howSteps') as step, n (n)}
				<li>
					<span
						class="grid size-9 place-items-center rounded-full bg-brand font-bold text-canvas tabular-nums"
						aria-hidden="true">{n + 1}</span
					>
					<p class="mt-3 text-muted">{step}</p>
				</li>
			{/each}
		</ol>
	</section>
</div>
