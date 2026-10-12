import { config } from '#lib/config.js';
import { t } from '#lib/i18n/index.js';

const priceFormatter = new Intl.NumberFormat(config.locale, {
	style: 'currency',
	currency: 'EUR',
	maximumFractionDigits: 0
});

/** 850 → "€ 850", 1450 → "€ 1.450" */
export function formatPrice(amountEur: number): string {
	return priceFormatter.format(amountEur);
}

const cmFormatter = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 1 });

/** "60 × 90 cm", or "60 × 90 × 4 cm" when a depth is given. Width first, as on a wall label. */
export function formatDimensions(dims: { widthCm: number; heightCm: number; depthCm?: number }) {
	const w = cmFormatter.format(dims.widthCm);
	const h = cmFormatter.format(dims.heightCm);
	return dims.depthCm
		? t('artwork.dimensions3d', { w, h, d: cmFormatter.format(dims.depthCm) })
		: t('artwork.dimensions', { w, h });
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Remaining time as "1d 14u 22m 05s". Below one hour only minutes and seconds ("22m 05s").
 * Minutes and seconds are padded to two digits.
 */
export function formatCountdown(ms: number): string {
	const total = Math.max(0, Math.floor(ms / 1000));
	const d = Math.floor(total / 86400);
	const h = Math.floor((total % 86400) / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	const u = {
		d: t('auction.countdown.d'),
		h: t('auction.countdown.h'),
		m: t('auction.countdown.m'),
		s: t('auction.countdown.s')
	};
	const minSec = `${pad(m)}${u.m} ${pad(s)}${u.s}`;
	if (d > 0) return `${d}${u.d} ${h}${u.h} ${minSec}`;
	if (h > 0) return `${h}${u.h} ${minSec}`;
	return minSec;
}

const relativeFormatter = new Intl.RelativeTimeFormat(config.locale, { numeric: 'auto' });

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['day', 86_400_000],
	['hour', 3_600_000],
	['minute', 60_000],
	['second', 1000]
];

/**
 * Relative time, e.g. "12 minuten geleden" or "over 3 dagen".
 * Depends on the clock, so render it only after mount to avoid hydration mismatches.
 */
export function formatRelative(date: string | number | Date, now: number = Date.now()): string {
	const diff = new Date(date).getTime() - now;
	for (const [unit, size] of RELATIVE_UNITS) {
		if (Math.abs(diff) >= size || unit === 'second') {
			return relativeFormatter.format(Math.round(diff / size), unit);
		}
	}
	return relativeFormatter.format(0, 'second');
}

/** "Inès Marrot – Fragment 12" → "ines-marrot-fragment-12" */
export function slugify(text: string): string {
	return text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
