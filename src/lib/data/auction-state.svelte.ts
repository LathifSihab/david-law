import type { AuctionLot, Bid } from '#lib/types.js';
import { t } from '#lib/i18n/index.js';
import { toast } from '#lib/components/toasts.svelte.js';
import { auctions } from './auctions.js';

/**
 * Session state for auction lots, shared by the home page, the overview and the lot page so they
 * always agree. Everything is client-side and resets on reload: no bid is ever sent anywhere.
 */
interface LotSession {
	bids: Bid[]; // newest first
	reserveMet: boolean;
	/** Soft close: total time added by bids in the last minute. */
	extendedMs: number;
}

const sessions: Record<string, LotSession> = $state(
	Object.fromEntries(
		auctions.map((lot) => [
			lot.slug,
			{
				bids: [...lot.seedBids],
				reserveMet: lot.reserveMet || (lot.seedBids[0]?.amountEur ?? 0) >= lot.reservePriceEur,
				extendedMs: 0
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

export function isReserveMet(lot: AuctionLot): boolean {
	return sessions[lot.slug]?.reserveMet ?? false;
}

// ---------------------------------------------------------------- timing

// DEMO: lots end `endsInMs` after the visitor first sees them, so the countdown is always live.
// The base time is computed lazily and cached per session (plain Maps: write-once, and writing
// reactive state while rendering isn't allowed). Soft-close extensions live in the reactive
// session, so countdowns pick them up. Only meaningful in the browser: Countdown renders "--"
// until mount, because the server's clock means nothing here.
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const endTimes = new Map<string, number>();
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const startTimes = new Map<string, number>();

export function getEndsAt(lot: AuctionLot): number {
	let base = endTimes.get(lot.slug);
	if (base === undefined) {
		base = Date.now() + lot.endsInMs;
		endTimes.set(lot.slug, base);
	}
	return base + (sessions[lot.slug]?.extendedMs ?? 0);
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

export function canBid(lot: AuctionLot): boolean {
	return lot.state === 'live' && Date.now() < getEndsAt(lot);
}

// ---------------------------------------------------------------- bidding

const SOFT_CLOSE_MS = 60_000;

const nowIso = () => new Date().toISOString();

const MAX_COUNTER_BIDS = 2; // per session, across all lots: charming, not annoying
let counterBidsUsed = 0;

/** Minimum step: the lot's increment (€25) below €1.000, €50 from €1.000 (docs/03). */
export function getIncrement(lot: AuctionLot, amount: number): number {
	return amount >= 1000 ? 50 : lot.bidIncrementEur;
}

export function getMinNextBid(lot: AuctionLot): number {
	const current = getCurrentBid(lot);
	return current === undefined ? lot.startingBidEur : current + getIncrement(lot, current);
}

/** Three quick bids, e.g. € 875, € 900, € 950 at a current bid of € 850 (docs/04). */
export function getQuickBids(lot: AuctionLot): number[] {
	const first = getMinNextBid(lot);
	const second = first + getIncrement(lot, first);
	const third = second + 2 * getIncrement(lot, second);
	return [first, second, third];
}

function addBid(lot: AuctionLot, bid: Bid): { extended: boolean } {
	const session = sessions[lot.slug];
	const extended = getEndsAt(lot) - Date.now() < SOFT_CLOSE_MS;
	session.bids = [bid, ...session.bids];
	if (bid.amountEur >= lot.reservePriceEur) session.reserveMet = true;
	if (extended) session.extendedMs += SOFT_CLOSE_MS;
	return { extended };
}

/**
 * Places a demo bid for "you". Validation (at least the minimum) is the caller's job, so the
 * bid box can show its own inline error. Returns whether the soft close extended the lot.
 */
export function placeBid(lot: AuctionLot, amountEur: number): { extended: boolean } {
	// Last line of defence, whatever the caller: a finite amount in whole cents, at least the
	// minimum, on an open lot. Anything else is ignored.
	const cents = Math.round(amountEur * 100);
	if (
		!Number.isFinite(amountEur) ||
		cents / 100 !== amountEur ||
		amountEur < getMinNextBid(lot) ||
		amountEur > 999_999_999 ||
		!canBid(lot)
	) {
		return { extended: false };
	}
	const result = addBid(lot, {
		amountEur,
		bidderLabel: t('auction.you'),
		placedAt: nowIso(),
		isYou: true
	});
	scheduleCounterBid(lot);
	return result;
}

/** Simulated competition: 20–40 s after your bid, someone outbids you. At most twice per session. */
function scheduleCounterBid(lot: AuctionLot) {
	if (counterBidsUsed >= MAX_COUNTER_BIDS) return;
	counterBidsUsed++;
	const delay = 20_000 + Math.random() * 20_000;
	setTimeout(() => {
		const top = sessions[lot.slug].bids[0];
		if (!top?.isYou || !canBid(lot)) return; // you were already outbid, or the lot closed
		const { extended } = addBid(lot, {
			amountEur: top.amountEur + getIncrement(lot, top.amountEur),
			bidderLabel: t('auction.bidderLabel', { n: 1000 + Math.floor(Math.random() * 9000) }),
			placedAt: nowIso()
		});
		toast.show(t('auction.toastOutbid'));
		if (extended) toast.show(t('auction.extended'));
	}, delay);
}
