<!-- Bid history (docs/04 section 6). Your own bids are highlighted. -->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import type { AuctionLot } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import { formatPrice, formatRelative } from '#lib/utils/format.js';
	import { getLotSession } from '#lib/data/auction-state.svelte.js';

	let { lot }: { lot: AuctionLot } = $props();

	const bids = $derived(getLotSession(lot).bids);

	// Relative times depend on the visitor's clock: render them only after mount, refresh every 30s
	// and whenever a bid arrives (otherwise a brand-new bid would read "over 3 seconden").
	let now = $state<number | null>(null);
	onMount(() => {
		now = Date.now();
		const timer = setInterval(() => (now = Date.now()), 30_000);
		return () => clearInterval(timer);
	});
	$effect(() => {
		if (bids.length && untrack(() => now) !== null) now = Date.now();
	});

	/** Never in the future: clamp to the bid time itself ("nu"). */
	const relative = (placedAt: string, at: number) =>
		formatRelative(placedAt, Math.max(at, Date.parse(placedAt)));
</script>

<table class="w-full text-left">
	<thead class="type-small text-aluminium">
		<tr class="border-b border-hairline">
			<th scope="col" class="py-3 pr-4 font-normal">{t('auction.historyBidder')}</th>
			<th scope="col" class="py-3 pr-4 font-normal">{t('auction.historyAmount')}</th>
			<th scope="col" class="py-3 text-right font-normal">{t('auction.historyTime')}</th>
		</tr>
	</thead>
	<tbody>
		{#each bids as bid (bid.placedAt + bid.amountEur)}
			<tr class="border-b border-hairline" class:bg-plinth={bid.isYou}>
				<td class="py-3 pr-4 pl-2" class:font-semibold={bid.isYou}>
					{bid.isYou ? t('auction.you') : bid.bidderLabel}
				</td>
				<td class="py-3 pr-4 font-semibold" style="font-variant-numeric: tabular-nums">
					{formatPrice(bid.amountEur)}
				</td>
				<td class="py-3 pr-2 text-right type-small text-aluminium">
					<time datetime={bid.placedAt}>{now === null ? '' : relative(bid.placedAt, now)}</time>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
