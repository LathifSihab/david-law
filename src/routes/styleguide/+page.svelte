<!--
	Internal styleguide (Task 2). Not linked from navigation; removed in Task 10.
	Section labels are English dev notes; all sample copy comes from the dictionary.
-->
<script lang="ts">
	import { t, tList } from '#lib/i18n/index.js';
	import { formatPrice } from '#lib/utils/format.js';
	import Button from '#lib/components/Button.svelte';
	import DemoBadge from '#lib/components/DemoBadge.svelte';
	import { getArtwork, getMainImage } from '#lib/data/artworks.js';
	import SpotlightFrame from '#lib/components/SpotlightFrame.svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import Dialog from '#lib/components/Dialog.svelte';
	import { toast } from '#lib/components/toasts.svelte.js';

	const colours = [
		{ token: 'wall', hex: '#1A1B1D', use: 'Page background' },
		{ token: 'wall-deep', hex: '#121315', use: 'Footer, image wells' },
		{ token: 'plinth', hex: '#24262A', use: 'Raised surfaces, inputs' },
		{ token: 'aluminium', hex: '#A9AEB4', use: 'Secondary text, hairlines' },
		{ token: 'paper', hex: '#ECEAE5', use: 'Primary text, primary button' },
		{ token: 'spot', hex: '#F3D9A4', use: 'Spotlight glow, focus rings only' },
		{ token: 'live', hex: '#E5A13A', use: 'Live auction state only' },
		{ token: 'demo', hex: '#7F8A9A', use: 'Demo badges and banner' }
	];

	const sample = getMainImage(getArtwork('david-law-crypto-nick-cave-vi')!);

	const mountedAt = Date.now();
	const countdowns = [
		{ label: '1d 14h 22m', endsAt: mountedAt + ((24 + 14) * 60 + 22) * 60_000 },
		{ label: '5h 10m', endsAt: mountedAt + (5 * 60 + 10) * 60_000 },
		{ label: '75s (closes while you watch)', endsAt: mountedAt + 75_000 },
		{ label: 'Already ended', endsAt: mountedAt - 1000 }
	];

	let checkoutOpen = $state(false);
	let lightsKey = $state(0);
</script>

<svelte:head>
	<title>Styleguide — {t('brand.name')}</title>
</svelte:head>

<div class="shell space-y-section py-16">
	<header class="space-y-3">
		<h1 class="type-h1">Styleguide</h1>
		<p class="max-w-measure text-aluminium">{t('brand.tagline')}</p>
	</header>

	<section class="space-y-6" aria-labelledby="sg-colours">
		<h2 id="sg-colours" class="type-h2">Colours</h2>
		<ul class="grid grid-cols-2 gap-6 sm:grid-cols-4">
			{#each colours as c (c.token)}
				<li class="space-y-2">
					<div
						class="aspect-[4/3] border border-hairline"
						style:background-color="var(--color-{c.token})"
					></div>
					<p class="type-small font-semibold">{c.token}</p>
					<p class="type-small text-aluminium">{c.hex}<br />{c.use}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section class="space-y-6" aria-labelledby="sg-type">
		<h2 id="sg-type" class="type-h2">Type scale</h2>
		<div class="space-y-8">
			<div>
				<p class="mb-1 type-small text-aluminium">display</p>
				<p class="type-display">Crypto Nick Cave VI</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">h1</p>
				<p class="type-h1">{t('catalogue.title')}</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">h2</p>
				<p class="type-h2">{t('home.featured')}</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">h3 (wall-label title, italic)</p>
				<p class="type-h3 italic">Crypto Nick Cave VI, 2023</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">body (max 68ch)</p>
				<p class="max-w-measure type-body">{tList('home.about')[0]}</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">small</p>
				<p class="type-small text-aluminium">{t('artwork.shippingNote')}</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">price</p>
				<p class="type-price">{formatPrice(1450)}</p>
			</div>
			<div>
				<p class="mb-1 type-small text-aluminium">price, live</p>
				<p class="type-price text-live">{t('auction.currentBid')} {formatPrice(850)}</p>
			</div>
		</div>
	</section>

	<section class="space-y-6" aria-labelledby="sg-buttons">
		<h2 id="sg-buttons" class="type-h2">Buttons and inputs</h2>
		<div class="flex flex-wrap items-center gap-4">
			<Button onclick={() => toast.show(t('demo.toastGeneric'))}>{t('artwork.buy')}</Button>
			<Button variant="secondary">{t('artwork.ask')}</Button>
			<Button variant="link" href="/collectie">{t('home.viewAll')}</Button>
			<Button href="/collectie">{t('nav.collection')}</Button>
			<Button disabled>{t('auction.placeBid')}</Button>
		</div>
		<label class="block max-w-xs space-y-2">
			<span class="type-small text-aluminium">{t('auction.yourBid')}</span>
			<input
				type="text"
				inputmode="numeric"
				value="875"
				class="block h-12 w-full rounded-control border border-hairline bg-plinth px-4 text-paper tabular-nums"
			/>
		</label>
	</section>

	<section class="space-y-6" aria-labelledby="sg-badges">
		<h2 id="sg-badges" class="type-h2">Demo badges</h2>
		<div class="flex flex-wrap items-center gap-4">
			<DemoBadge />
			<DemoBadge kind="artist" />
		</div>
	</section>

	<section class="space-y-6" aria-labelledby="sg-spotlight">
		<h2 id="sg-spotlight" class="type-h2">Spotlight frame</h2>
		<div class="grid gap-6 md:grid-cols-2">
			<SpotlightFrame>
				<img
					src={sample.src}
					width={sample.width}
					height={sample.height}
					alt={sample.alt}
					decoding="async"
					loading="lazy"
					class="h-auto max-h-[480px] w-auto"
				/>
			</SpotlightFrame>
			<div class="space-y-3">
				{#key lightsKey}
					<SpotlightFrame lightsOn class="aspect-square">
						<p class="type-small text-aluminium">lightsOn (900ms)</p>
					</SpotlightFrame>
				{/key}
				<Button variant="secondary" onclick={() => lightsKey++}>Replay</Button>
			</div>
		</div>
	</section>

	<section class="space-y-6" aria-labelledby="sg-countdown">
		<h2 id="sg-countdown" class="type-h2">Countdown</h2>
		<dl class="grid gap-4 sm:grid-cols-2">
			{#each countdowns as c (c.label)}
				<div class="border border-hairline bg-plinth p-4">
					<dt class="type-small text-aluminium">{c.label}</dt>
					<dd class="type-price"><Countdown endsAt={c.endsAt} /></dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="space-y-6" aria-labelledby="sg-feedback">
		<h2 id="sg-feedback" class="type-h2">Toast and dialog</h2>
		<div class="flex flex-wrap gap-4">
			<Button variant="secondary" onclick={() => toast.show(t('auction.toastPlaced'))}>
				Toast
			</Button>
			<Button variant="secondary" onclick={() => (checkoutOpen = true)}>Dialog</Button>
		</div>
	</section>
</div>

<Dialog bind:open={checkoutOpen} title={t('artwork.checkoutTitle')}>
	<p class="type-h3 italic">Crypto Nick Cave VI, 2023</p>
	<p class="mt-2 type-price">{formatPrice(1450)}</p>
	<p class="mt-4 type-small text-aluminium">{t('artwork.shippingNote')}</p>
	{#snippet actions()}
		<Button variant="secondary" onclick={() => (checkoutOpen = false)}>{t('artwork.cancel')}</Button
		>
		<Button
			onclick={() => {
				checkoutOpen = false;
				toast.show(t('demo.toastCheckout'));
			}}
		>
			{t('artwork.toCheckout')}
		</Button>
	{/snippet}
</Dialog>
