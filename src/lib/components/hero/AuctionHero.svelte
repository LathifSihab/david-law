<!-- Veilingen hero: "the auction block". One running lot at a time stands in a spotlight with its
     lot number behind it; lots rotate on a timer (paused on hover/focus, off with reduced motion)
     and a ticker of current bids runs along the bottom. -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import { t } from '#lib/i18n/index.js';
	import type { Artwork, AuctionLot } from '#lib/types.js';
	import { getMainImage } from '#lib/data/artworks.js';
	import { getArtist } from '#lib/data/artists.js';
	import { getCurrentBid, getEndsAt } from '#lib/data/auction-state.svelte.js';
	import { formatLotNumber, formatPrice } from '#lib/utils/format.js';
	import Countdown from '../Countdown.svelte';
	import DemoBadge from '../DemoBadge.svelte';
	import HeroHeading from './HeroHeading.svelte';

	interface Props {
		/** Running lots, closing soonest first. */
		lots: { lot: AuctionLot; artwork: Artwork }[];
		upcomingCount: number;
	}

	let { lots, upcomingCount }: Props = $props();

	const ROTATE_MS = 6000;
	const id = $props.id();

	let active = $state(0);
	let paused = $state(false);
	let reduced = $state(true);
	onMount(() => (reduced = matchMedia('(prefers-reduced-motion: reduce)').matches));

	const current = $derived(lots[active]);
	const image = $derived(current && getMainImage(current.artwork));
	const bid = $derived(current && getCurrentBid(current.lot));
	const ratio = $derived(image ? image.height / image.width : 1);

	// Next lot on the block. Re-runs (and restarts the timer) whenever `active` changes.
	$effect(() => {
		if (reduced || paused || lots.length < 2) return;
		const next = (active + 1) % lots.length;
		const timer = setTimeout(() => (active = next), ROTATE_MS);
		return () => clearTimeout(timer);
	});

	const tickerItems = $derived(
		lots.map(({ lot, artwork }) => ({
			key: lot.slug,
			lot: t('auction.lot', { n: formatLotNumber(lot.lotNumber) }),
			title: artwork.title,
			artist: getArtist(artwork.artistSlug)?.name ?? '',
			amount: formatPrice(getCurrentBid(lot) ?? lot.startingBidEur)
		}))
	);
</script>

<section class="shell pt-5 md:pt-8" aria-labelledby="{id}-title">
	<div
		role="group"
		aria-labelledby="{id}-title"
		class="ember relative isolate overflow-hidden rounded-card bg-ember text-canvas"
		onpointerenter={() => (paused = true)}
		onpointerleave={() => (paused = false)}
		onfocusin={() => (paused = true)}
		onfocusout={() => (paused = false)}
	>
		<div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
			<div class="flex flex-col justify-center p-6 sm:p-10 lg:py-14 lg:pr-4 lg:pl-12">
				<HeroHeading
					id="{id}-title"
					eyebrow={t('auction.indexTitle')}
					title={t('auction.heroTitle')}
					accent={t('auction.heroAccent')}
					intro={t('auction.heroIntro')}
					muted="text-ember-muted"
					accentClass="text-flame"
					live={lots.length > 0}
				>
					<dl class="flex flex-wrap gap-x-10 gap-y-4 border-t border-canvas/15 pt-6">
						<div class="flex flex-col-reverse">
							<dt class="type-small text-ember-muted">{t('auction.heroRunning')}</dt>
							<dd class="font-display text-4xl leading-none font-medium">{lots.length}</dd>
						</div>
						<div class="flex flex-col-reverse">
							<dt class="type-small text-ember-muted">{t('auction.heroUpcoming')}</dt>
							<dd class="font-display text-4xl leading-none font-medium">{upcomingCount}</dd>
						</div>
					</dl>
				</HeroHeading>
			</div>

			<!-- The block -->
			{#if current && image}
				<div class="stage relative h-[30rem] sm:h-[34rem] lg:h-auto lg:min-h-[36rem]">
					<div class="beam pointer-events-none absolute inset-0" aria-hidden="true"></div>

					<!-- Lot number, huge and hollow, behind the work -->
					<div class="pointer-events-none absolute inset-x-0 top-[4%] grid" aria-hidden="true">
						{#key current.lot.slug}
							<span
								class="lot-number col-start-1 row-start-1 text-center font-display leading-none font-medium"
								in:fly={{ y: 40, duration: reduced ? 0 : 900, easing: cubicOut }}
								out:fade={{ duration: reduced ? 0 : 300 }}
							>
								{formatLotNumber(current.lot.lotNumber)}
							</span>
						{/key}
					</div>

					<!-- The work, standing on the floor of the stage -->
					<div
						class="plinth absolute inset-x-0 top-[10%] bottom-[15.5rem] grid sm:bottom-[16.5rem]"
					>
						{#key current.lot.slug}
							<div
								class="col-start-1 row-start-1 flex min-h-0 items-end justify-center"
								in:fly={{ y: -24, duration: reduced ? 0 : 1000, easing: cubicOut }}
								out:fade={{ duration: reduced ? 0 : 350 }}
							>
								<!-- Sized to the work's own proportions: as tall as fits, at most 56% wide. -->
								<div
									class="relative"
									style="height: min(100cqh, {(56 * ratio).toFixed(
										2
									)}cqw); width: calc(min(100cqh, {(56 * ratio).toFixed(2)}cqw) / {ratio.toFixed(
										4
									)})"
								>
									<img
										src={image.thumb}
										width={image.width}
										height={image.height}
										alt={image.alt}
										decoding="async"
										fetchpriority="high"
										class="work block size-full"
									/>
									{#if current.artwork.isDemo}
										<DemoBadge class="absolute top-2 left-2" />
									{/if}
								</div>
							</div>
						{/key}
					</div>
					<div
						class="floor pointer-events-none absolute inset-x-0 bottom-[15.5rem] sm:bottom-[16.5rem]"
						aria-hidden="true"
					></div>

					<!-- Lot card -->
					<div class="absolute inset-x-4 bottom-20 sm:inset-x-10 sm:bottom-24 lg:inset-x-12">
						<a
							href={resolve('/veilingen/[slug]', { slug: current.lot.slug })}
							class="group block rounded-control border border-canvas/15 bg-canvas/[0.06] p-4 backdrop-blur-md transition-colors hover:bg-canvas/10"
						>
							<div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
								<div class="min-w-0">
									<p class="text-xs font-semibold tracking-[0.18em] text-flame uppercase">
										{t('auction.lot', { n: formatLotNumber(current.lot.lotNumber) })}
									</p>
									<p class="mt-1 truncate font-semibold group-hover:underline">
										{current.artwork.title}
									</p>
									<p class="truncate type-small text-ember-muted">
										{getArtist(current.artwork.artistSlug)?.name}
									</p>
								</div>
								<div class="text-right">
									<p class="text-xs text-ember-muted">
										{bid !== undefined ? t('auction.currentBid') : t('auction.startingBid')}
									</p>
									<p class="text-xl font-bold">{formatPrice(bid ?? current.lot.startingBidEur)}</p>
									<p class="type-small text-ember-muted">
										{t('auction.closesIn')}
										<Countdown
											endsAt={getEndsAt(current.lot)}
											live={false}
											class="font-semibold text-canvas"
										/>
									</p>
								</div>
							</div>
						</a>

						<!-- One segment per lot; the active one fills up until the next lot comes on. -->
						<div class="mt-3 flex gap-1.5">
							{#each lots as { lot }, i (lot.slug)}
								<button
									type="button"
									class="group/seg flex h-6 flex-1 items-center"
									aria-label={t('auction.heroShowLot', { n: formatLotNumber(lot.lotNumber) })}
									aria-current={i === active}
									onclick={() => (active = i)}
								>
									<span
										class="relative block h-0.5 w-full overflow-hidden rounded-full bg-canvas/20 group-hover/seg:bg-canvas/40"
									>
										{#if i === active}
											{#key active}
												<span
													class="progress absolute inset-0 origin-left bg-flame"
													class:paused
													style="--rotate: {ROTATE_MS}ms"
												></span>
											{/key}
										{:else if i < active}
											<span class="absolute inset-0 bg-canvas/50"></span>
										{/if}
									</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Bid ticker (decorative: the same lots are listed in full below the hero) -->
		{#if tickerItems.length}
			<div
				class="ticker bg-black/25 relative overflow-hidden border-t border-canvas/10 py-3"
				aria-hidden="true"
			>
				<div class="ticker-track flex w-max">
					{#each [0, 1] as copy (copy)}
						<ul class="flex shrink-0 items-center">
							{#each tickerItems as item (item.key)}
								<li class="flex items-center gap-3 px-6 type-small whitespace-nowrap">
									<span class="size-1.5 rounded-full bg-live"></span>
									<span class="font-semibold tracking-[0.14em] text-flame uppercase"
										>{item.lot}</span
									>
									<span class="font-display text-base italic">{item.title}</span>
									<span class="text-ember-muted">{item.artist}</span>
									<span class="font-semibold">{item.amount}</span>
								</li>
							{/each}
						</ul>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.ember {
		background:
			radial-gradient(70% 60% at 75% 30%, rgb(194 65 12 / 0.22), transparent 70%),
			radial-gradient(50% 50% at 0% 100%, rgb(242 164 107 / 0.08), transparent 70%),
			var(--color-ember);
	}

	/* A spotlight cone from the ceiling onto the block. */
	.beam {
		background: linear-gradient(to bottom, rgb(255 222 190 / 0.2), rgb(255 222 190 / 0.03) 70%);
		clip-path: polygon(42% 0, 58% 0, 92% 100%, 8% 100%);
		animation:
			lights-on 1600ms var(--ease-gallery) both,
			flicker 7s ease-in-out 1600ms infinite;
	}

	@keyframes flicker {
		50% {
			opacity: 0.75;
		}
	}

	.lot-number {
		font-size: clamp(8rem, 20vw, 15rem);
		color: transparent;
		-webkit-text-stroke: 1px rgb(242 164 107 / 0.2);
	}

	/* The floor the work stands on, lit where the beam lands. */
	.floor {
		height: 4rem;
		translate: 0 50%;
		background: radial-gradient(40% 50% at 50% 50%, rgb(0 0 0 / 0.55), transparent 70%);
	}

	.plinth {
		container-type: size;
	}

	.work {
		box-shadow:
			0 0 0 1px rgb(255 255 255 / 0.08),
			0 30px 60px -20px rgb(0 0 0 / 0.8);
	}

	.progress {
		animation: fill var(--rotate) linear both;
	}

	.progress.paused {
		animation-play-state: paused;
	}

	@keyframes fill {
		from {
			scale: 0 1;
		}
	}

	.ticker {
		mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
	}

	.ticker-track {
		animation: ticker 40s linear infinite;
	}

	.ticker:hover .ticker-track {
		animation-play-state: paused;
	}

	@keyframes ticker {
		to {
			translate: -50% 0;
		}
	}
</style>
