<!-- Auctions overview (docs/04 section 5): Lopend (closing soonest first) and Binnenkort tabs. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '#lib/i18n/index.js';
	import type { AuctionLot } from '#lib/types.js';
	import { getArtworkById, getMainImage } from '#lib/data/artworks.js';
	import { getLiveAuctions, getUpcomingAuctions } from '#lib/data/auctions.js';
	import { getEndsAt, getStartsAt } from '#lib/data/auction-state.svelte.js';
	import { formatLotNumber } from '#lib/utils/format.js';
	import WallLabel from '#lib/components/WallLabel.svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import Button from '#lib/components/Button.svelte';

	const withArtwork = (lots: AuctionLot[]) =>
		lots.flatMap((lot) => {
			const artwork = getArtworkById(lot.artworkId);
			return artwork ? [{ lot, artwork, image: getMainImage(artwork) }] : [];
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

<div class="shell pt-10 md:pt-14">
	<h1 class="type-h1">{t('auction.indexTitle')}</h1>

	<div
		role="tablist"
		aria-label={t('auction.indexTitle')}
		class="mt-8 flex gap-8 border-b border-hairline"
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
				class="-mb-px min-h-11 border-b-2 border-transparent pb-3 text-aluminium hover:text-paper aria-selected:border-paper aria-selected:text-paper"
				onclick={() => (active = i)}
				onkeydown={onTabKeydown}
			>
				{tab.label}
				<span class="type-small tabular-nums">({tab.lots.length})</span>
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
			class="outline-none focus-visible:outline-2"
		>
			<ul class="divide-y divide-hairline">
				{#each tab.lots as { lot, artwork, image }, j (lot.slug)}
					{@const href = resolve('/veilingen/[slug]', { slug: lot.slug })}
					{@const startsAt = getStartsAt(lot)}
					<li
						class="grid gap-6 py-10 sm:grid-cols-[12rem_minmax(0,1fr)] md:grid-cols-[14rem_minmax(0,1fr)_auto] md:items-end md:gap-10"
					>
						<a {href} tabindex="-1" aria-hidden="true" class="flex h-48 items-end">
							<span class="relative max-w-full">
								<img
									src={image.thumb}
									width={image.width}
									height={image.height}
									alt=""
									loading={j < 2 ? 'eager' : 'lazy'}
									decoding="async"
									class="block h-auto max-h-48 w-auto max-w-full"
								/>
								{#if artwork.isDemo}
									<DemoBadge class="absolute top-2 left-2" />
								{/if}
							</span>
						</a>

						<div>
							<p class="mb-2 type-small text-aluminium tabular-nums">
								{t('auction.lot', { n: formatLotNumber(lot.lotNumber) })}
							</p>
							<WallLabel {artwork} headingLevel="h2" />
						</div>

						<div class="space-y-3 sm:col-start-2 md:col-start-auto md:text-right">
							<p class="type-small text-aluminium">
								{#if lot.state === 'live'}
									{t('auction.closesIn')}
									<Countdown endsAt={getEndsAt(lot)} class="type-price" />
								{:else if startsAt}
									<Countdown
										endsAt={startsAt}
										live={false}
										class="text-paper"
										template={(time) => t('auction.startsIn', { time })}
									/>
								{/if}
							</p>
							<Button {href} variant={lot.state === 'live' ? 'primary' : 'secondary'}>
								{t('home.toAuction')}
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
