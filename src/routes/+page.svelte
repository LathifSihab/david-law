<!-- Home (docs/04 section 1): a marketplace front page. Sells the platform, not one artist. -->
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
	import { getCurrentBid, getEndsAt } from '#lib/data/auction-state.svelte.js';
	import {
		TECHNIQUE_GROUPS,
		getTechniqueGroup,
		sortWorks,
		surnameKey
	} from '#lib/utils/catalogue.js';
	import { formatPrice } from '#lib/utils/format.js';
	import { LIMITS, isPlausibleEmail, sanitizeText } from '#lib/utils/input.js';
	import { TILE_ROW, TILE_ROW_ITEM } from '#lib/utils/layout.js';
	import Button from '#lib/components/Button.svelte';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import SectionHeading from '#lib/components/SectionHeading.svelte';
	import { toast } from '#lib/components/toasts.svelte.js';

	// The first featured work is the featured lot in the hero; the rest form the Uitgelicht row.
	const [heroWork, ...featured] = getFeatured();
	const heroLot = getAuction(heroWork.auctionSlug ?? '');
	const heroImage = getMainImage(heroWork);
	const heroArtist = artists.find((a) => a.slug === heroWork.artistSlug);
	const heroHref = heroLot
		? resolve('/veilingen/[slug]', { slug: heroLot.slug })
		: resolve('/collectie/[slug]', { slug: heroWork.slug });

	const closingSoon = getLiveAuctions().flatMap((lot) => {
		const artwork = getArtworkById(lot.artworkId);
		return artwork ? [{ lot, artwork }] : [];
	});

	const newest = sortWorks(
		artworks.filter((w) => w.status !== 'verkocht'),
		'newest'
	).slice(0, 5);
	const buyNowCount = artworks.filter((w) => w.status === 'te-koop').length;

	// One tile per technique, illustrated by a featured work of that technique where possible.
	const categories = TECHNIQUE_GROUPS.map((group) => {
		const works = artworks.filter((w) => getTechniqueGroup(w) === group.key);
		const cover = works.find((w) => w.featured) ?? works[0];
		return {
			...group,
			count: works.length,
			cover,
			image: cover && getMainImage(cover)
		};
	});

	// By surname, as a gallery would: no single artist leads the list.
	const artistList = [...artists]
		.sort((a, b) => surnameKey(a.name).localeCompare(surnameKey(b.name), 'nl'))
		.map((artist) => {
			const works = getWorksByArtist(artist.slug);
			const cover = works.find((w) => w.featured) ?? works[0];
			return { artist, count: works.length, image: cover && getMainImage(cover) };
		});

	const usps = [
		{ key: 'selected', icon: 'M5 12.5l4.5 4.5L19 7.5' },
		{ key: 'choice', icon: 'M4 7h16M4 12h10M4 17h6' },
		{ key: 'certificate', icon: 'M7 3.5h10v17H7zM10 8h4M10 12h4M10 16h2' },
		{
			key: 'shipping',
			icon: 'M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4zM3.5 7.5L12 11.5l8.5-4M12 11.5v9'
		}
	] as const;

	const steps = ['discover', 'bid', 'receive'] as const;

	/** Newsletter: validated like a real form, then discarded. Nothing is sent or stored (docs/07). */
	function subscribe(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const field = form.elements.namedItem('email') as HTMLInputElement;
		const email = sanitizeText(field.value, LIMITS.email);
		field.setCustomValidity(isPlausibleEmail(email) ? '' : t('artwork.inquiryEmailInvalid'));
		if (!form.reportValidity()) return;
		form.reset();
		toast.show(t('demo.toastNewsletter'));
	}
</script>

<svelte:head>
	<title>{t('meta.homeTitle')}</title>
	<meta name="description" content={t('meta.homeDescription')} />
	<link rel="preload" as="image" href={heroImage.src} fetchpriority="high" />
</svelte:head>

<div class="space-y-section pt-5 md:pt-8">
	<!-- Hero: the platform's promise with one featured lot, plus two promo cards -->
	<section
		class="shell grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5"
		aria-labelledby="hero-title"
	>
		<div
			class="grid overflow-hidden rounded-card bg-night text-canvas md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
		>
			<div class="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
				{#if heroLot?.state === 'live'}
					<p
						class="inline-flex w-fit items-center gap-2 rounded-full bg-canvas/10 px-3 py-1 type-small font-semibold"
					>
						<span class="relative flex size-2" aria-hidden="true">
							<span
								class="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-75"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-live"></span>
						</span>
						{t('home.liveAuction')}
					</p>
				{/if}
				<h1 id="hero-title" class="mt-4 max-w-[17ch] type-display text-balance">
					{t('brand.tagline')}
				</h1>
				<p class="mt-4 max-w-[46ch] text-night-muted">{t('home.heroIntro')}</p>

				<div class="mt-6 rounded-control border border-canvas/15 p-4">
					<p class="type-small text-night-muted">{t('home.featuredLot')}</p>
					<p class="mt-1 font-semibold">{heroWork.title}</p>
					<p class="type-small text-night-muted">{heroArtist?.name}, {heroWork.year}</p>
					{#if heroLot}
						{@const bid = getCurrentBid(heroLot)}
						<div class="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
							<div>
								<p class="text-xs text-night-muted">
									{bid !== undefined ? t('auction.currentBid') : t('auction.startingBid')}
								</p>
								<p class="text-2xl font-bold">{formatPrice(bid ?? heroLot.startingBidEur)}</p>
							</div>
							{#if heroLot.state === 'live'}
								<p class="type-small text-night-muted">
									{t('auction.closesIn')}
									<Countdown
										endsAt={getEndsAt(heroLot)}
										live={false}
										class="font-semibold text-canvas"
									/>
								</p>
							{/if}
						</div>
					{/if}
				</div>

				<div class="mt-6 flex flex-wrap gap-3">
					<Button href={heroHref}>{heroLot ? t('home.bidNow') : t('home.toAuction')}</Button>
					<Button href={resolve('/collectie')} variant="ghost">{t('home.viewCollection')}</Button>
				</div>
			</div>

			<a
				href={heroHref}
				tabindex="-1"
				aria-hidden="true"
				class="hero-wall relative flex items-center justify-center px-8 pb-8 md:min-h-full md:p-8"
			>
				<img
					src={heroImage.src}
					width={heroImage.width}
					height={heroImage.height}
					alt={heroImage.alt}
					fetchpriority="high"
					decoding="async"
					class="relative block max-h-72 w-auto max-w-full shadow-[0_24px_60px_-12px_rgb(0_0_0/0.8)] md:max-h-[32rem]"
					style="aspect-ratio: {heroImage.width} / {heroImage.height}; height: auto"
				/>
			</a>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
			<a
				href={resolve('/veilingen')}
				class="group flex flex-col justify-between gap-6 rounded-card bg-brand-tint p-6 transition-shadow hover:shadow-raised"
			>
				<div>
					<p class="type-small font-semibold text-brand">
						{plural(closingSoon.length, 'home.lotsCountOne', 'home.lotsCount')}
					</p>
					<h2 class="mt-1 type-h2 group-hover:underline group-hover:underline-offset-4">
						{t('home.promoAuctionsTitle')}
					</h2>
					<p class="mt-1 text-muted">{t('home.promoAuctionsText')}</p>
				</div>
				<div class="flex -space-x-4" aria-hidden="true">
					{#each closingSoon.slice(0, 4) as { artwork } (artwork.id)}
						{@const image = getMainImage(artwork)}
						<img
							src={image.thumb}
							width={image.width}
							height={image.height}
							alt=""
							decoding="async"
							class="size-20 rounded-control border-2 border-brand-tint bg-canvas object-cover"
						/>
					{/each}
				</div>
			</a>

			<a
				href={resolve('/collectie?status=te-koop')}
				class="group flex flex-col justify-between gap-6 rounded-card bg-surface p-6 ring-1 ring-line transition-shadow ring-inset hover:shadow-raised"
			>
				<div>
					<p class="type-small font-semibold text-brand">
						{t('home.promoBuyText', { count: buyNowCount })}
					</p>
					<h2 class="mt-1 type-h2 group-hover:underline group-hover:underline-offset-4">
						{t('home.promoBuyTitle')}
					</h2>
					<p class="mt-1 text-muted">{t('home.featuredSubtitle')}</p>
				</div>
				<div class="flex -space-x-4" aria-hidden="true">
					{#each featured.slice(0, 4) as artwork (artwork.id)}
						{@const image = getMainImage(artwork)}
						<img
							src={image.thumb}
							width={image.width}
							height={image.height}
							alt=""
							decoding="async"
							class="size-20 rounded-control border-2 border-surface bg-canvas object-cover"
						/>
					{/each}
				</div>
			</a>
		</div>
	</section>

	<!-- Why Kunstkamer: four short promises -->
	<section class="shell -mt-[calc(var(--spacing-section)/2)]" aria-labelledby="usp-title">
		<h2 id="usp-title" class="sr-only">{t('home.uspTitle')}</h2>
		<ul
			class="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
		>
			{#each usps as usp (usp.key)}
				<li class="flex items-center gap-4 bg-canvas p-4 sm:p-5">
					<span
						class="grid size-11 shrink-0 place-items-center rounded-full bg-brand-tint text-brand"
					>
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d={usp.icon} />
						</svg>
					</span>
					<div>
						<p class="font-semibold">{t(`home.usp.${usp.key}.title`)}</p>
						<p class="type-small text-muted">{t(`home.usp.${usp.key}.text`)}</p>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Sluit binnenkort: every live lot, soonest first -->
	<section class="shell" aria-labelledby="closing-title">
		<SectionHeading
			id="closing-title"
			title={t('home.closingSoon')}
			subtitle={t('home.closingSoonSubtitle')}
			href={resolve('/veilingen')}
			linkLabel={t('home.allAuctions')}
		/>
		<ul class="{TILE_ROW} lg:grid-cols-5">
			{#each closingSoon as { lot, artwork } (lot.slug)}
				<li class={TILE_ROW_ITEM}>
					<ArtworkTile {artwork} {lot} />
				</li>
			{/each}
		</ul>
	</section>

	<!-- Populaire categorieën -->
	<section class="shell" aria-labelledby="browse-title">
		<SectionHeading id="browse-title" title={t('home.categoriesTitle')} />
		<ul class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
			{#each categories as category (category.key)}
				<li>
					<a href={resolve(`/collectie?techniek=${category.param}`)} class="group block">
						<div
							class="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card bg-well p-[12%] transition-shadow group-hover:shadow-raised"
						>
							{#if category.image}
								<img
									src={category.image.thumb}
									width={category.image.width}
									height={category.image.height}
									alt=""
									loading="lazy"
									decoding="async"
									class="block max-h-full w-auto max-w-full shadow-[0_6px_18px_-6px_rgb(16_18_24/0.35)] transition-transform duration-300 group-hover:scale-105"
									style="aspect-ratio: {category.image.width} / {category.image
										.height}; height: auto"
								/>
							{/if}
							{#if category.cover?.isDemo}
								<DemoBadge class="absolute top-3 left-3" />
							{/if}
						</div>
						<p
							class="mt-3 font-semibold group-hover:text-brand group-hover:underline group-hover:underline-offset-4"
						>
							{t(`catalogue.technique.${category.key}`)}
						</p>
						<p class="type-small text-muted tabular-nums">
							{plural(category.count, 'home.worksCountOne', 'home.worksCount')}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Uitgelicht -->
	<section class="shell" aria-labelledby="featured-title">
		<SectionHeading
			id="featured-title"
			title={t('home.featured')}
			subtitle={t('home.featuredSubtitle')}
			href={resolve('/collectie')}
			linkLabel={t('home.viewAll')}
		/>
		<ul class="{TILE_ROW} lg:grid-cols-4">
			{#each featured as artwork (artwork.id)}
				<li class={TILE_ROW_ITEM}>
					<ArtworkTile {artwork} />
				</li>
			{/each}
		</ul>
	</section>

	<!-- Zo werkt Kunstkamer -->
	<section class="bg-surface py-section" aria-labelledby="how-title">
		<div class="shell">
			<h2 id="how-title" class="type-h2">{t('home.howTitle')}</h2>
			<ol class="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
				{#each steps as step, i (step)}
					<li class="rounded-card bg-canvas p-6 ring-1 ring-line ring-inset">
						<span
							class="grid size-10 place-items-center rounded-full bg-brand font-bold text-canvas tabular-nums"
							aria-hidden="true">{i + 1}</span
						>
						<p class="mt-4 type-h3">{t(`home.how.${step}.title`)}</p>
						<p class="mt-1 text-muted">{t(`home.how.${step}.text`)}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- Nieuw in de collectie -->
	<section class="shell" aria-labelledby="new-title">
		<SectionHeading
			id="new-title"
			title={t('home.newTitle')}
			subtitle={t('home.newSubtitle')}
			href={resolve('/collectie')}
			linkLabel={t('home.viewAll')}
		/>
		<ul class="{TILE_ROW} lg:grid-cols-5">
			{#each newest as artwork (artwork.id)}
				<li class={TILE_ROW_ITEM}>
					<ArtworkTile {artwork} />
				</li>
			{/each}
		</ul>
	</section>

	<!-- Kunstenaars -->
	<section class="shell" aria-labelledby="artists-title">
		<SectionHeading
			id="artists-title"
			title={t('home.artistsTitle')}
			href={resolve('/kunstenaars')}
			linkLabel={t('home.allArtists')}
		/>
		<ul
			class="-mx-gutter no-scrollbar flex gap-5 overflow-x-auto px-gutter pb-2 lg:mx-0 lg:justify-between lg:px-0"
		>
			{#each artistList as { artist, count, image } (artist.slug)}
				<li class="w-28 shrink-0">
					<a
						href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
						class="group flex flex-col items-center text-center"
					>
						<span
							class="block size-24 overflow-hidden rounded-full bg-well ring-2 ring-line ring-offset-2 transition-shadow group-hover:ring-brand"
						>
							{#if image}
								<img
									src={image.thumb}
									width={image.width}
									height={image.height}
									alt=""
									loading="lazy"
									decoding="async"
									class="size-full object-cover"
								/>
							{/if}
						</span>
						<span
							class="mt-3 leading-tight font-semibold group-hover:text-brand group-hover:underline"
						>
							{artist.name}
						</span>
						<span class="mt-0.5 type-small text-muted tabular-nums">
							{plural(count, 'home.worksCountOne', 'home.worksCount')}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Over het platform + nieuwsbrief -->
	<section class="shell grid gap-5 lg:grid-cols-2" aria-labelledby="about-title">
		<div class="rounded-card p-6 ring-1 ring-line ring-inset sm:p-8 lg:p-10">
			<h2 id="about-title" class="type-h2">{t('home.aboutTitle')}</h2>
			<div class="mt-4 space-y-3 text-muted">
				{#each tList('home.about') as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
			</div>
		</div>

		<div class="flex flex-col justify-center rounded-card bg-brand p-6 text-canvas sm:p-8 lg:p-10">
			<h2 class="type-h2">{t('home.newsletterTitle')}</h2>
			<p class="mt-2 text-canvas/85">{t('home.newsletterText')}</p>
			<form class="mt-6 flex flex-col gap-3 sm:flex-row" novalidate onsubmit={subscribe}>
				<label for="newsletter-email" class="sr-only">{t('home.newsletterLabel')}</label>
				<input
					id="newsletter-email"
					name="email"
					type="email"
					autocomplete="email"
					spellcheck="false"
					required
					maxlength={LIMITS.email}
					placeholder={t('home.newsletterLabel')}
					oninput={(e) => e.currentTarget.setCustomValidity('')}
					class="h-12 min-w-0 flex-1 rounded-control bg-canvas px-4 text-ink placeholder:text-muted focus-visible:outline-canvas"
				/>
				<button
					type="submit"
					class="h-12 shrink-0 rounded-control bg-night px-6 font-semibold text-canvas hover:bg-ink focus-visible:outline-canvas"
				>
					{t('home.newsletterButton')}
				</button>
			</form>
		</div>
	</section>
</div>

<style>
	/* The featured lot hangs on a dark wall under a warm spotlight that fades in on load. */
	.hero-wall::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 50% 35%, rgb(243 217 164 / 0.16), transparent 62%);
		animation: lights-on 900ms var(--ease-gallery) both;
	}
</style>
