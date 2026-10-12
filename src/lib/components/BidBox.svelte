<!--
	The full bid box (docs/04 section 6). Demo only: bids live in session state and are never sent.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import type { AuctionLot } from '#lib/types.js';
	import { t, plural } from '#lib/i18n/index.js';
	import { formatLotNumber, formatPrice } from '#lib/utils/format.js';
	import {
		getBidCount,
		getCurrentBid,
		getEndsAt,
		getMinNextBid,
		getQuickBids,
		getStartsAt,
		isReserveMet,
		placeBid
	} from '#lib/data/auction-state.svelte.js';
	import { toast } from './toasts.svelte.js';
	import Countdown from './Countdown.svelte';
	import Button from './Button.svelte';

	let { lot }: { lot: AuctionLot } = $props();

	const isLive = $derived(lot.state === 'live');
	const current = $derived(getCurrentBid(lot));
	const count = $derived(getBidCount(lot));
	const min = $derived(getMinNextBid(lot));
	const quickBids = $derived(getQuickBids(lot));
	const reserveMet = $derived(isReserveMet(lot));
	const endsAt = $derived(getEndsAt(lot)); // moves when the soft close extends the lot
	const startsAt = $derived(getStartsAt(lot));

	let closed = $state(false);
	const open = $derived(isLive && !closed);

	// The input holds whatever is typed; it resets to the new minimum after every bid.
	let input = $derived(String(min));
	const amount = $derived(Number(input.replace(/\D/g, '')) || 0);

	let error = $state('');
	let confirming = $state<number | null>(null);
	let confirmButton = $state<HTMLButtonElement>();
	let flashKey = $state(0);

	async function requestConfirm(value: number) {
		if (!open) return;
		if (value < min) {
			error = t('auction.errorTooLow', { amount: formatPrice(min) });
			return;
		}
		error = '';
		confirming = value;
		await tick();
		confirmButton?.focus();
	}

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		requestConfirm(amount);
	}

	function confirm() {
		if (confirming === null) return;
		const { extended } = placeBid(lot, confirming);
		confirming = null;
		flashKey++;
		toast.show(t('auction.toastPlaced'));
		if (extended) toast.show(t('auction.extended'));
	}
</script>

<div class="bg-plinth p-5 sm:p-6">
	<!-- 1. Lot and state -->
	<p class="flex items-center gap-3 type-small text-aluminium">
		<span>{t('auction.lot', { n: formatLotNumber(lot.lotNumber) })}</span>
		{#if open}
			<span class="flex items-center gap-1.5 text-live">
				<span class="size-2 animate-pulse rounded-full bg-live" aria-hidden="true"></span>
				{t('auction.live')}
			</span>
		{/if}
	</p>

	<!-- 2. Current bid -->
	<div class="mt-4" aria-live="polite">
		<p class="type-small text-aluminium">
			{current !== undefined ? t('auction.currentBid') : t('auction.startingBid')}
		</p>
		{#key flashKey}
			<p
				class="-mx-1 px-1 text-[2rem] leading-tight font-semibold"
				class:text-live={open}
				class:flash={flashKey > 0}
			>
				{formatPrice(current ?? lot.startingBidEur)}
			</p>
		{/key}
	</div>
	{#if count > 0}
		<a
			href="#history"
			class="inline-flex min-h-11 items-center type-small text-aluminium underline underline-offset-4 hover:text-paper"
		>
			{plural(count, 'auction.bidsCountOne', 'auction.bidsCount')}
		</a>
	{/if}

	<!-- 3. Countdown -->
	<p class="mt-4 type-small text-aluminium">
		{#if isLive}
			{#if !closed}{t('auction.closesIn')}{/if}
			<Countdown {endsAt} class="type-price" onend={() => (closed = true)} />
		{:else if startsAt}
			<Countdown
				endsAt={startsAt}
				live={false}
				class="text-paper"
				template={(time) => t('auction.startsIn', { time })}
			/>
		{/if}
	</p>

	<!-- 4. Reserve -->
	{#if isLive}
		<p class="mt-2 flex items-center gap-2 type-small" class:text-aluminium={!reserveMet}>
			{#if reserveMet}
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					aria-hidden="true"
				>
					<path d="M3 8.5l3 3 7-7" />
				</svg>
				{t('auction.reserveMet')}
			{:else}
				{t('auction.reserveNotMet')}
			{/if}
		</p>
	{/if}

	<div class="mt-6 border-t border-hairline pt-6">
		{#if confirming !== null}
			<!-- Confirm step -->
			<p class="type-h3">{t('auction.confirmBid', { amount: formatPrice(confirming) })}</p>
			<div class="mt-5 grid grid-cols-2 gap-3">
				<Button variant="secondary" onclick={() => (confirming = null)}
					>{t('auction.cancel')}</Button
				>
				<button
					bind:this={confirmButton}
					type="button"
					class="min-h-12 rounded-control bg-paper px-6 font-medium text-wall transition-colors hover:bg-aluminium"
					onclick={confirm}
				>
					{t('auction.confirm')}
				</button>
			</div>
		{:else}
			<form onsubmit={onSubmit} novalidate>
				<!-- 5. Bid input -->
				<label for="bid-amount" class="type-small">{t('auction.yourBid')}</label>
				<div
					class="mt-1.5 flex h-12 items-center rounded-control border border-hairline bg-wall focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-spot"
					class:border-live={error}
				>
					<span class="pl-4 text-aluminium" aria-hidden="true">€</span>
					<input
						id="bid-amount"
						bind:value={input}
						oninput={() => (error = '')}
						type="text"
						inputmode="numeric"
						autocomplete="off"
						disabled={!open}
						aria-invalid={error ? 'true' : undefined}
						aria-describedby="bid-hint{error ? ' bid-error' : ''}"
						class="h-full min-w-0 flex-1 bg-transparent px-2 text-lg font-semibold text-paper outline-none disabled:opacity-50"
						style="font-variant-numeric: tabular-nums"
					/>
				</div>
				<p id="bid-hint" class="mt-1.5 type-small text-aluminium">
					{t('auction.minBid', { amount: formatPrice(min) })}
				</p>
				{#if error}
					<p id="bid-error" class="mt-1 type-small text-live" role="alert">{error}</p>
				{/if}

				<!-- 6. Quick bids -->
				<div class="mt-4 grid grid-cols-3 gap-2">
					{#each quickBids as value (value)}
						<button
							type="button"
							disabled={!open}
							class="min-h-11 rounded-control border border-hairline px-2 font-medium hover:border-paper disabled:cursor-not-allowed disabled:opacity-50"
							onclick={() => {
								input = String(value);
								requestConfirm(value);
							}}
						>
							{formatPrice(value)}
						</button>
					{/each}
				</div>

				<!-- 7. Place bid -->
				<Button type="submit" disabled={!open} class="mt-4 w-full">{t('auction.placeBid')}</Button>
			</form>
		{/if}

		<!-- 8. Fine print -->
		<p class="mt-4 type-small text-aluminium">{t('auction.fee', { pct: lot.buyerFeePct })}</p>
	</div>
</div>

<style>
	/* The new bid briefly lights up, then settles (instant with reduced motion). */
	.flash {
		animation: bid-flash 1.2s var(--ease-gallery);
	}

	@keyframes bid-flash {
		from {
			background-color: rgb(229 161 58 / 0.28);
		}
		to {
			background-color: transparent;
		}
	}
</style>
