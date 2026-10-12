// Data shapes from docs/03-data-model.md. They map one-to-one onto Carl's future Excel columns.

export type ArtworkStatus = 'te-koop' | 'veiling' | 'verkocht' | 'op-aanvraag';

export interface ArtworkImage {
	src: string; // e.g. '/artworks/david-law-crypto-nick-cave-vi/main.webp'
	thumb: string; // 480px version for tiles and thumbnails
	width: number; // intrinsic px, used for aspect ratio
	height: number;
	alt: string; // Dutch, descriptive
	role: 'main' | 'detail' | 'signature' | 'context';
}

export interface Edition {
	size: number; // number of regular prints, e.g. 8
	artistProofs?: number; // e.g. 4
	label?: string; // this specific copy, e.g. '1/4 E.A.' or '3/8'
}

export interface Artwork {
	id: string; // stable id, maps to Excel "ID" column
	slug: string; // url-safe, unique
	title: string;
	artistSlug: string;
	series?: string; // e.g. 'Crypto Rock Special Series'
	year: number;
	technique: string; // Dutch, e.g. 'Fotografische compositie'
	support: string; // Dutch, e.g. 'Print op aluminium'
	widthCm: number;
	heightCm: number;
	depthCm?: number;
	edition?: Edition; // undefined = unique work
	signed: boolean;
	signatureNote?: string; // e.g. 'Genummerd en gesigneerd op de achterzijde'
	certificate: boolean; // show "Certificaat van echtheid inbegrepen". NEVER the certificate itself
	description: string; // Dutch, public description (1–3 short paragraphs)
	details?: string[]; // extra public bullet facts (mounting, protection, ...)
	priceEur?: number; // undefined = "Prijs op aanvraag"
	status: ArtworkStatus;
	auctionSlug?: string; // set when status === 'veiling'
	images: ArtworkImage[]; // first image with role 'main' is used for tiles
	featured?: boolean; // show on home page
	addedAt: string; // ISO date, used for "Nieuwste" sort
	isDemo: boolean; // true = placeholder work, shows DemoBadge
}

export interface Artist {
	slug: string;
	name: string;
	basedIn?: string; // e.g. 'Parijs'
	shortBio: string; // 1–2 sentences, for tiles
	bio: string[]; // paragraphs, public only
	portrait?: ArtworkImage;
	isDemo: boolean;
}

export interface Bid {
	amountEur: number;
	bidderLabel: string; // anonymised, e.g. 'Bieder 4821'. Never real names
	placedAt: string; // ISO
	isYou?: boolean; // bids placed in this session
}

export interface AuctionLot {
	slug: string;
	artworkId: string;
	lotNumber: number;
	startingBidEur: number;
	reserveMet: boolean;
	/** Internal minimum price. Never displayed as an amount; only drives "Minimumprijs bereikt". */
	reservePriceEur: number;
	bidIncrementEur: number; // minimum step
	buyerFeePct: number; // shown as info only
	endsInMs: number; // DEMO: end time = page open + this. Keeps the countdown always live
	/** DEMO, 'binnenkort' only: start time = page open + this. Not in docs/03; needed for "Start over 3 dagen". */
	startsInMs?: number;
	state: 'live' | 'binnenkort' | 'gesloten';
	seedBids: Bid[]; // newest first
	isDemo: boolean;
}
