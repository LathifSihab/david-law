import { t } from '#lib/i18n/index.js';
import type { AuctionLot, Bid } from '#lib/types.js';

// docs/03. ALL AMOUNTS ARE DEMO VALUES (docs/08 Q3).

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Seed bid placed `minutesAgo` before the page was opened. Times depend on the clock, so the bid
 * history must render relative times only after mount (see formatRelative).
 */
function seedBid(amountEur: number, bidder: number, minutesAgo: number): Bid {
	return {
		amountEur,
		bidderLabel: t('auction.bidderLabel', { n: bidder }),
		placedAt: new Date(Date.now() - minutesAgo * MINUTE).toISOString()
	};
}

export const auctions: AuctionLot[] = [
	{
		slug: 'crypto-nick-cave-vi',
		artworkId: 'CR-0001',
		lotNumber: 1,
		startingBidEur: 400,
		reserveMet: false, // flips to true at the first bid of €900 or more
		bidIncrementEur: 25, // €25 below €1.000, €50 from €1.000 (see Task 8 bid logic)
		buyerFeePct: 9,
		endsInMs: DAY + 14 * HOUR + 22 * MINUTE,
		state: 'live',
		seedBids: [
			seedBid(850, 4821, 8),
			seedBid(800, 1376, 34),
			seedBid(725, 4821, 110),
			seedBid(600, 9054, 300),
			seedBid(500, 2213, 545),
			seedBid(425, 1376, 1460)
		],
		// The artwork is real; the lot itself still uses demo amounts.
		isDemo: false
	},
	{
		slug: 'demo-veiling-2',
		artworkId: 'D-07',
		lotNumber: 2,
		startingBidEur: 200,
		reserveMet: false,
		bidIncrementEur: 25,
		buyerFeePct: 9,
		endsInMs: 5 * HOUR + 10 * MINUTE,
		state: 'live',
		seedBids: [seedBid(340, 6609, 21), seedBid(300, 3187, 95), seedBid(225, 6609, 260)],
		isDemo: true
	},
	{
		slug: 'demo-veiling-3',
		artworkId: 'D-10',
		lotNumber: 3,
		startingBidEur: 300,
		reserveMet: false,
		bidIncrementEur: 25,
		buyerFeePct: 9,
		startsInMs: 3 * DAY,
		endsInMs: 10 * DAY,
		state: 'binnenkort',
		seedBids: [],
		isDemo: true
	}
];

const bySlug = new Map(auctions.map((lot) => [lot.slug, lot]));

export function getAuction(slug: string): AuctionLot | undefined {
	return bySlug.get(slug);
}

export function getLiveAuctions(): AuctionLot[] {
	return auctions.filter((lot) => lot.state === 'live');
}

export function getUpcomingAuctions(): AuctionLot[] {
	return auctions.filter((lot) => lot.state === 'binnenkort');
}
