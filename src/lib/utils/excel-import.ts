import { getArtist } from '#lib/data/artists.js';
import { getArtworkById } from '#lib/data/artworks.js';

/*
 * Excel import mock (docs/04 section 7, column mapping in docs/03). Pure functions: the page reads
 * the file with SheetJS and hands the rows here. Nothing is uploaded or stored.
 */

/** The proposed Excel template, in column order. Headers are what Carl sees. */
export const IMPORT_COLUMNS = [
	{ key: 'id', header: 'ID' },
	{ key: 'artist', header: 'Kunstenaar' },
	{ key: 'title', header: 'Titel' },
	{ key: 'series', header: 'Reeks' },
	{ key: 'year', header: 'Jaar' },
	{ key: 'technique', header: 'Techniek' },
	{ key: 'support', header: 'Drager' },
	{ key: 'widthCm', header: 'Breedte (cm)' },
	{ key: 'heightCm', header: 'Hoogte (cm)' },
	{ key: 'depthCm', header: 'Diepte (cm)' },
	{ key: 'editionSize', header: 'Oplage' },
	{ key: 'artistProofs', header: 'E.A.' },
	{ key: 'editionLabel', header: 'Exemplaar' },
	{ key: 'signed', header: 'Gesigneerd (ja/nee)' },
	{ key: 'certificate', header: 'Certificaat (ja/nee)' },
	{ key: 'description', header: 'Beschrijving' },
	{ key: 'price', header: 'Prijs (€)' },
	{ key: 'status', header: 'Status' },
	{ key: 'images', header: 'Afbeeldingen' }
] as const;

export type ColumnKey = (typeof IMPORT_COLUMNS)[number]['key'];
export type Issue = 'missingTitle' | 'missingImage' | 'missingPrice';

export interface ImportRow {
	values: Partial<Record<ColumnKey, string>>;
	issues: Issue[];
}

export interface ImportResult {
	rows: ImportRow[];
	/** Headers we don't know (internal notes, purchase price, ...). Never imported (docs/07). */
	ignored: string[];
}

/** "Prijs (€)", "prijs", "PRIJS" → "prijs"; "Gesigneerd (ja/nee)" → "gesigneerd". */
function normaliseHeader(header: string): string {
	return header
		.toLowerCase()
		.replace(/\(.*?\)/g, '')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z]/g, '');
}

const KEY_BY_HEADER = new Map<string, ColumnKey>(
	IMPORT_COLUMNS.map((c) => [normaliseHeader(c.header), c.key])
);

/** "€ 1.450", "1450", "1.450,00" → 1450. Undefined when empty or not a number. */
export function parsePrice(raw: string | undefined): number | undefined {
	if (!raw?.trim()) return undefined;
	const cleaned = raw
		.replace(/[€\s]/g, '')
		.replace(/\.(?=\d{3}(\D|$))/g, '')
		.replace(',', '.');
	const n = Number(cleaned);
	return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** "te koop", "Te-koop" → "te-koop" (docs/03 statuses). */
export function normaliseStatus(raw: string | undefined): string {
	return (raw ?? '').trim().toLowerCase().replace(/\s+/g, '-');
}

function validate(values: Partial<Record<ColumnKey, string>>): Issue[] {
	const issues: Issue[] = [];
	if (!values.title?.trim()) issues.push('missingTitle');
	if (!values.images?.trim()) issues.push('missingImage');
	// A price is only required for fixed-price works; auctions and "op aanvraag" don't need one.
	if (normaliseStatus(values.status) === 'te-koop' && parsePrice(values.price) === undefined)
		issues.push('missingPrice');
	return issues;
}

/**
 * Maps a sheet (array of rows, as SheetJS `sheet_to_json(..., { header: 1 })` returns it) onto the
 * template columns. Returns null when no header row with at least two known columns is found in
 * the first five rows: then it isn't a catalogue file.
 */
export function mapSheet(sheet: unknown[][]): ImportResult | null {
	const asText = (cell: unknown) =>
		cell === null || cell === undefined ? '' : String(cell).trim();

	const headerIndex = sheet
		.slice(0, 5)
		.findIndex(
			(row) => row.filter((cell) => KEY_BY_HEADER.has(normaliseHeader(asText(cell)))).length >= 2
		);
	if (headerIndex < 0) return null;

	const header = sheet[headerIndex].map(asText);
	const columns = header.map((h) => KEY_BY_HEADER.get(normaliseHeader(h)));
	const ignored = header.filter((h, i) => h && !columns[i]);

	const rows = sheet
		.slice(headerIndex + 1)
		.map((row) => row.map(asText))
		.filter((row) => row.some(Boolean))
		.map((row) => {
			const values: Partial<Record<ColumnKey, string>> = {};
			columns.forEach((key, i) => {
				if (key && row[i]) values[key] = row[i];
			});
			return { values, issues: validate(values) };
		});

	return { rows, ignored };
}

/** The downloadable template: the header row plus the real David Law work as an example. */
export function templateRows(): string[][] {
	const artwork = getArtworkById('CR-0001');
	const header = IMPORT_COLUMNS.map((c) => c.header);
	if (!artwork) return [header];

	const yesNo = (value: boolean) => (value ? 'ja' : 'nee');
	const folder = artwork.images[0]?.src.split('/').at(-2) ?? '';
	const example: Record<ColumnKey, string> = {
		id: artwork.id,
		artist: getArtist(artwork.artistSlug)?.name ?? '',
		title: artwork.title,
		series: artwork.series ?? '',
		year: String(artwork.year),
		technique: artwork.technique,
		support: artwork.support,
		widthCm: String(artwork.widthCm),
		heightCm: String(artwork.heightCm),
		depthCm: artwork.depthCm ? String(artwork.depthCm) : '',
		editionSize: artwork.edition ? String(artwork.edition.size) : '',
		artistProofs: artwork.edition?.artistProofs ? String(artwork.edition.artistProofs) : '',
		editionLabel: artwork.edition?.label ?? '',
		signed: yesNo(artwork.signed),
		certificate: yesNo(artwork.certificate),
		description: artwork.description,
		price: artwork.priceEur ? String(artwork.priceEur) : '',
		status: artwork.status.replace('-', ' '),
		images: folder
	};
	return [header, IMPORT_COLUMNS.map((c) => example[c.key])];
}
