/*
 * Input hardening shared by every form. Rendering is already safe (Svelte escapes all text and
 * no component uses {@html}); these helpers make sure each field only *accepts* what it should.
 */

/** Longest amount we accept: 9 digits before the separator (< € 1 billion). */
const MAX_INTEGER_DIGITS = 9;

/**
 * Keeps only what a currency amount may contain while typing: digits and one decimal separator
 * ("," or ".", as Belgians type either), with at most `decimals` digits after it.
 * "abc9e0-0,555" → "900,55", "€ 1.250,00" → "1250,00".
 */
export function sanitizeAmountInput(raw: string, decimals = 2): string {
	// Dutch notation: the comma is the decimal separator and dots group thousands. So with a
	// comma present, dots are thousands ("€ 1.250,00" → "1250,00"); without one, dots in groups of
	// three are thousands too ("1.250" → "1250"). Any other dot is a decimal point ("12.5").
	if (raw.includes(',') || /^\D*\d{1,3}(\.\d{3})+\D*$/.test(raw)) raw = raw.replace(/\./g, '');
	let integer = '';
	let fraction = '';
	let separator = '';
	for (const char of raw) {
		if (char >= '0' && char <= '9') {
			if (separator) {
				if (fraction.length < decimals) fraction += char;
			} else if (integer.length < MAX_INTEGER_DIGITS) {
				integer += char;
			}
		} else if ((char === ',' || char === '.') && !separator && decimals > 0) {
			separator = char;
		}
	}
	// "007" → "7", but keep a single "0" (e.g. "0,50").
	integer = integer.replace(/^0+(?=\d)/, '');
	if (separator && !integer) integer = '0';
	return integer + separator + fraction;
}

/** Strict parse of a sanitised amount: "900,50" → 900.5. Anything else → undefined. */
export function parseAmount(raw: string | null | undefined, decimals = 2): number | undefined {
	if (raw === null || raw === undefined) return undefined;
	const pattern = new RegExp(`^\\d{1,${MAX_INTEGER_DIGITS}}([.,]\\d{1,${decimals}})?$`);
	const trimmed = raw.trim();
	if (!pattern.test(trimmed)) return undefined;
	return Number(trimmed.replace(',', '.'));
}

/**
 * Control characters (except tab, newline and carriage return), zero-width characters, bidi
 * overrides and the byte-order mark: invisible, but able to hide or reorder text.
 */
function isUnsafeChar(char: string): boolean {
	const code = char.codePointAt(0) ?? 0;
	return (
		(code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) ||
		code === 0x7f ||
		(code >= 0x200b && code <= 0x200f) ||
		(code >= 0x202a && code <= 0x202e) ||
		(code >= 0x2066 && code <= 0x2069) ||
		code === 0xfeff
	);
}

/**
 * Plain text from a form field: removes invisible/control characters (which can hide or reorder
 * text), collapses whitespace unless `multiline`, trims, and caps the length.
 */
export function sanitizeText(raw: string, maxLength: number, multiline = false): string {
	let text = [...raw].filter((char) => !isUnsafeChar(char)).join('');
	text = multiline ? text.replace(/\r\n?/g, '\n') : text.replace(/\s+/g, ' ');
	return text.trim().slice(0, maxLength);
}

/** Field limits, used both as `maxlength` attributes and when sanitising. */
export const LIMITS = {
	search: 100,
	name: 100,
	email: 254,
	message: 2000,
	cell: 500
} as const;

/** Practical e-mail check on top of the browser's type="email" validation. */
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export function isPlausibleEmail(email: string): boolean {
	return EMAIL.test(email);
}
