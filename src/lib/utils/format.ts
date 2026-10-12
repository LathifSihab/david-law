import { config } from '#lib/config.js';
import { t } from '#lib/i18n/index.js';

// formatDimensions, formatRelative and slugify follow in Task 3.

const priceFormatter = new Intl.NumberFormat(config.locale, {
	style: 'currency',
	currency: 'EUR',
	maximumFractionDigits: 0
});

/** 850 → "€ 850", 1450 → "€ 1.450" */
export function formatPrice(amountEur: number): string {
	return priceFormatter.format(amountEur);
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
