<!-- Artwork detail (docs/04 section 3). -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t, plural } from '#lib/i18n/index.js';
	import { config } from '#lib/config.js';
	import { artworks, getMainImage } from '#lib/data/artworks.js';
	import { getArtist } from '#lib/data/artists.js';
	import { getAuction } from '#lib/data/auctions.js';
	import {
		getBidCount,
		getCurrentBid,
		getEndsAt,
		getStartsAt
	} from '#lib/data/auction-state.svelte.js';
	import { formatLotNumber, formatPrice } from '#lib/utils/format.js';
	import { getRelatedWorks } from '#lib/utils/catalogue.js';
	import { TILE_ROW, TILE_ROW_ITEM } from '#lib/utils/layout.js';
	import Gallery from '#lib/components/Gallery.svelte';
	import ArtworkInfo from '#lib/components/ArtworkInfo.svelte';
	import Button from '#lib/components/Button.svelte';
	import Dialog from '#lib/components/Dialog.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import FavouriteButton from '#lib/components/FavouriteButton.svelte';
	import KeyFacts from '#lib/components/KeyFacts.svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';
	import SectionHeading from '#lib/components/SectionHeading.svelte';
	import { toast } from '#lib/components/toasts.svelte.js';
	import { LIMITS, isPlausibleEmail, sanitizeText } from '#lib/utils/input.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const artwork = $derived(data.artwork);
	const artist = $derived(getArtist(artwork.artistSlug));
	const lot = $derived(artwork.auctionSlug ? getAuction(artwork.auctionSlug) : undefined);
	const related = $derived(getRelatedWorks(artwork, artworks));

	// Dialogs. Nothing is bought or sent: they end in a demo toast (CLAUDE.md rule 7, docs/07).
	let buyOpen = $state(false);
	let inquiry = $state<'price' | 'question' | null>(null);
	let inquiryOpen = $state(false);

	function openInquiry(kind: 'price' | 'question') {
		inquiry = kind;
		inquiryOpen = true;
	}

	/**
	 * Validates like a real form would (a name that isn't only spaces or invisible characters, a
	 * plausible e-mail address), then discards everything: nothing is sent or stored (docs/07).
	 */
	function submitInquiry(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
		const name = sanitizeText(field('name').value, LIMITS.name);
		const email = sanitizeText(field('email').value, LIMITS.email);
		field('name').setCustomValidity(name ? '' : t('artwork.inquiryNameInvalid'));
		field('email').setCustomValidity(
			isPlausibleEmail(email) ? '' : t('artwork.inquiryEmailInvalid')
		);
		if (!form.reportValidity()) return;
		form.reset();
		inquiryOpen = false;
		toast.show(t('demo.toastInquiry'));
	}

	/** Typing again clears a custom validation message. */
	function clearValidity(event: Event) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		target.setCustomValidity?.('');
	}

	function checkout() {
		buyOpen = false;
		toast.show(t('demo.toastCheckout'));
	}
</script>

<svelte:head>
	<title>{artwork.title}, {artist?.name} — {config.brandName}</title>
	<meta name="description" content={artwork.description} />
	<link rel="preload" as="image" href={artwork.images[0].src} fetchpriority="high" />
</svelte:head>

<div class="shell pt-6 md:pt-10">
	<nav aria-label={t('artwork.breadcrumbLabel')} class="mb-6 type-small text-muted">
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
			<li>
				<a
					href={resolve('/collectie')}
					class="-my-3 inline-block py-3 hover:text-brand hover:underline"
					>{t('artwork.breadcrumbRoot')}</a
				>
			</li>
			<li aria-hidden="true">/</li>
			{#if artist}
				<li>
					<a
						href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
						class="-my-3 inline-block py-3 hover:text-brand hover:underline">{artist.name}</a
					>
				</li>
				<li aria-hidden="true">/</li>
			{/if}
			<li aria-current="page" class="text-ink">{artwork.title}</li>
		</ol>
	</nav>

	<div
		class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10"
	>
		<!-- Keyed, so moving to another work starts at its first image -->
		{#key artwork.id}
			<Gallery images={artwork.images} isDemo={artwork.isDemo} />
		{/key}

		<!-- Sticky on desktop while the gallery scrolls -->
		<div
			class="self-start rounded-card border border-line p-5 sm:p-6 lg:sticky lg:top-36 lg:p-7 lg:shadow-card"
		>
			{#if artist}
				<a
					href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
					class="-my-3 inline-block py-3 font-semibold text-brand decoration-1 underline-offset-4 hover:underline"
				>
					{artist.name}
				</a>
			{/if}
			<div class="mt-1 flex items-start justify-between gap-4">
				<h1 class="type-h1">{artwork.title}</h1>
				<FavouriteButton id={artwork.id} title={artwork.title} class="shrink-0 ring-1 ring-line" />
			</div>
			<p class="mt-2 text-muted">
				{artwork.madeIn ? `${artwork.madeIn}, ${artwork.year}` : artwork.year}
			</p>
			{#if artwork.isDemo}
				<DemoBadge class="mt-4" />
			{/if}
			<KeyFacts {artwork} />

			<div class="mt-6 border-t border-line pt-6">
				{#if artwork.status === 'veiling' && lot}
					{@const bid = getCurrentBid(lot)}
					{@const isLive = lot.state === 'live'}
					{@const startsAt = getStartsAt(lot)}
					<div class="rounded-control bg-surface p-5 ring-1 ring-line ring-inset">
						<p class="flex items-center gap-3 type-small text-muted">
							<span>{t('auction.lot', { n: formatLotNumber(lot.lotNumber) })}</span>
							{#if isLive}
								<span class="flex items-center gap-1.5 text-live">
									<span class="size-2 rounded-full bg-live" aria-hidden="true"></span>
									{t('auction.live')}
								</span>
							{/if}
						</p>
						<p class="mt-4 type-small text-muted">
							{bid !== undefined ? t('auction.currentBid') : t('auction.startingBid')}
						</p>
						<p class="text-[1.75rem] leading-tight font-bold" class:text-live={isLive}>
							{formatPrice(bid ?? lot.startingBidEur)}
						</p>
						{#if bid !== undefined}
							<p class="mt-1 type-small text-muted tabular-nums">
								{plural(getBidCount(lot), 'auction.bidsCountOne', 'auction.bidsCount')}
							</p>
						{/if}
						<p class="mt-4 type-small text-muted">
							{#if isLive}
								{t('auction.closesIn')} <Countdown endsAt={getEndsAt(lot)} class="type-price" />
							{:else if startsAt}
								<Countdown
									endsAt={startsAt}
									live={false}
									class="text-ink"
									template={(time) => t('auction.startsIn', { time })}
								/>
							{/if}
						</p>
						<Button href={resolve('/veilingen/[slug]', { slug: lot.slug })} class="mt-6 w-full">
							{t('home.toAuction')}
						</Button>
					</div>
				{:else if artwork.status === 'te-koop' && artwork.priceEur !== undefined}
					<p class="text-[1.75rem] leading-tight font-bold">
						{formatPrice(artwork.priceEur)}
					</p>
					<div class="mt-5 grid gap-3 sm:grid-cols-2">
						<Button onclick={() => (buyOpen = true)}>{t('artwork.buy')}</Button>
						<Button variant="secondary" onclick={() => openInquiry('question')}>
							{t('artwork.ask')}
						</Button>
					</div>
				{:else if artwork.status === 'verkocht'}
					<p class="type-h3">{t('artwork.soldLong')}</p>
					<Button
						variant="link"
						href={resolve(`/collectie?kunstenaar=${artwork.artistSlug}`)}
						class="mt-2"
					>
						{t('artwork.similarWorks')}
					</Button>
				{:else}
					<p class="type-h3">{t('artwork.priceOnRequest')}</p>
					<Button class="mt-5 w-full sm:w-auto" onclick={() => openInquiry('price')}>
						{t('artwork.requestPrice')}
					</Button>
				{/if}
			</div>

			<!-- Trust row. Shipping and returns are demo copy (docs/08 Q5). -->
			<ul class="mt-6 space-y-3 rounded-control bg-surface p-4 type-small">
				{#if artwork.certificate}
					<li class="flex items-start gap-3">
						<svg
							class="mt-0.5 shrink-0 text-brand"
							width="18"
							height="18"
							viewBox="0 0 18 18"
							fill="none"
							stroke="currentColor"
							stroke-width="1.25"
							aria-hidden="true"
						>
							<rect x="3" y="2" width="12" height="14" rx="0.5" /><path d="M6 6h6M6 9h6M6 12h3" />
						</svg>
						{t('artwork.trust.certificate')}
					</li>
				{/if}
				<li class="flex items-start gap-3">
					<svg
						class="mt-0.5 shrink-0 text-brand"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						stroke="currentColor"
						stroke-width="1.25"
						aria-hidden="true"
					>
						<path d="M2.5 5.5L9 2.5l6.5 3v7L9 15.5l-6.5-3z" /><path
							d="M2.5 5.5L9 8.5l6.5-3M9 8.5v7"
						/>
					</svg>
					{t('artwork.trust.shipping')}
				</li>
				<li class="flex items-start gap-3">
					<svg
						class="mt-0.5 shrink-0 text-brand"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						stroke="currentColor"
						stroke-width="1.25"
						aria-hidden="true"
					>
						<path d="M3.5 9a5.5 5.5 0 1 0 1.6-3.9" /><path d="M3 2.5v3h3" />
					</svg>
					{t('artwork.trust.returns')}
				</li>
			</ul>
		</div>
	</div>

	<ArtworkInfo {artwork} />

	<!-- Meer van deze kunstenaar / Misschien ook iets voor jou -->
	{#if related.works.length}
		<section class="mt-section" aria-labelledby="related">
			<SectionHeading
				id="related"
				title={related.byArtist && artist
					? t('artwork.moreByArtist', { name: artist.name })
					: t('artwork.youMightLike')}
			/>
			<ul class="{TILE_ROW} lg:grid-cols-4">
				{#each related.works as work (work.id)}
					<li class={TILE_ROW_ITEM}>
						<ArtworkTile artwork={work} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<!-- Buy: a summary, then a demo toast. Nothing is bought. -->
<Dialog bind:open={buyOpen} title={t('artwork.checkoutTitle')}>
	{@const image = getMainImage(artwork)}
	<div class="flex gap-4">
		<img
			src={image.thumb}
			width={image.width}
			height={image.height}
			alt=""
			class="block h-24 w-auto shrink-0"
		/>
		<div>
			<p class="font-semibold">{artist?.name}</p>
			<p class="type-h3">{artwork.title}, {artwork.year}</p>
			{#if artwork.priceEur !== undefined}
				<p class="mt-2 type-price">{formatPrice(artwork.priceEur)}</p>
			{/if}
		</div>
	</div>
	<p class="mt-5 type-small text-muted">{t('artwork.shippingNote')}</p>
	{#snippet actions()}
		<Button variant="secondary" onclick={() => (buyOpen = false)}>{t('artwork.cancel')}</Button>
		<Button onclick={checkout}>{t('artwork.toCheckout')}</Button>
	{/snippet}
</Dialog>

<!-- Price request / question: a 3-field form. Not sent, not stored (docs/07). -->
<Dialog
	bind:open={inquiryOpen}
	title={inquiry === 'price' ? t('artwork.inquiryTitle') : t('artwork.ask')}
>
	<form class="space-y-4" onsubmit={submitInquiry} oninput={clearValidity}>
		<p class="type-small text-muted">{artist?.name}, <i>{artwork.title}</i></p>
		<label class="block space-y-1.5">
			<span class="type-small">{t('artwork.inquiryName')}</span>
			<input
				name="name"
				autocomplete="name"
				maxlength={LIMITS.name}
				required
				class="block h-11 w-full rounded-control border border-line bg-canvas px-3 text-ink"
			/>
		</label>
		<label class="block space-y-1.5">
			<span class="type-small">{t('artwork.inquiryEmail')}</span>
			<input
				name="email"
				type="email"
				autocomplete="email"
				maxlength={LIMITS.email}
				spellcheck="false"
				required
				class="block h-11 w-full rounded-control border border-line bg-canvas px-3 text-ink"
			/>
		</label>
		<label class="block space-y-1.5">
			<span class="type-small">{t('artwork.inquiryMessage')}</span>
			<textarea
				name="message"
				rows="4"
				maxlength={LIMITS.message}
				class="block w-full rounded-control border border-line bg-canvas px-3 py-2 text-ink"
			></textarea>
		</label>
		<div class="flex flex-wrap justify-end gap-3 pt-2">
			<Button variant="secondary" onclick={() => (inquiryOpen = false)}>
				{t('artwork.cancel')}
			</Button>
			<Button type="submit">{t('artwork.inquirySend')}</Button>
		</div>
	</form>
</Dialog>
