import type { AuctionLot, Bid } from '#lib/types.js';
import { auctions } from './auctions.js';

/**
 * Session state for auction lots, shared by the home page, the overview and the lot page so they
 * always agree. Bidding (Task 8) will add to this module.
 */
interface LotSession {
	bids: Bid[]; // newest first
	reserveMet: boolean;
}

const sessions: Record<string, LotSession> = $state(
	Object.fromEntries(
		auctions.map((lot) => [
			lot.slug,
			{
				bids: [...lot.seedBids],
				reserveMet: lot.reserveMet || (lot.seedBids[0]?.amountEur ?? 0) >= lot.reservePriceEur
			}
		])
	)
);

export function getLotSession(lot: AuctionLot): LotSession {
	return sessions[lot.slug];
}

/** The highest bid so far, or undefined when nobody has bid yet. */
export function getCurrentBid(lot: AuctionLot): number | undefined {
	return sessions[lot.slug]?.bids[0]?.amountEur;
}

export function getBidCount(lot: AuctionLot): number {
	return sessions[lot.slug]?.bids.length ?? 0;
}

// DEMO: lots end `endsInMs` after the visitor first sees them, so the countdown is always live.
// Computed lazily and cached per session, so every page shows the same time. Only read these in
// the browser (Countdown renders "--" until mount), because the server's clock is meaningless here.
// Plain Maps on purpose: write-once caches, nothing needs to react to them.
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const endTimes = new Map<string, number>();
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const startTimes = new Map<string, number>();

export function getEndsAt(lot: AuctionLot): number {
	let endsAt = endTimes.get(lot.slug);
	if (endsAt === undefined) {
		endsAt = Date.now() + lot.endsInMs;
		endTimes.set(lot.slug, endsAt);
	}
	return endsAt;
}

export function getStartsAt(lot: AuctionLot): number | undefined {
	if (lot.startsInMs === undefined) return undefined;
	let startsAt = startTimes.get(lot.slug);
	if (startsAt === undefined) {
		startsAt = Date.now() + lot.startsInMs;
		startTimes.set(lot.slug, startsAt);
	}
	return startsAt;
}
