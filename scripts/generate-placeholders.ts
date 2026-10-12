/**
 * Generates the 11 abstract placeholder images in static/placeholders/ (docs/02, docs/03).
 * Deterministic: the same seed always gives the same image. Run with `npm run placeholders`.
 *
 * These are deliberately plain compositions (bands, fields, grids, gradients) so nobody mistakes
 * them for real artworks. They don't imitate any real artist.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Rng = () => number;
type Palette = readonly string[];
type Style = 'bands' | 'fields' | 'collage' | 'concentric' | 'grid' | 'gradient';

interface Spec {
	file: string; // must match the image src in src/lib/data/artworks.ts
	width: number;
	height: number;
	style: Style;
	palette: Palette;
	seed: number;
}

const PALETTES = {
	tide: ['#26323a', '#3f555c', '#6d837f', '#a9ab97', '#d3c8ae'],
	clay: ['#33292a', '#5e4538', '#8f6a50', '#b99a7c', '#ddcdb8'],
	moss: ['#232b2a', '#3d4b45', '#62705f', '#9a9d82', '#cfc8ae'],
	rust: ['#2f2421', '#6f3f2c', '#a46a45', '#c9a275', '#e4d8c2'],
	dusk: ['#25222c', '#433d52', '#6d6680', '#a59cae', '#d8cfcc'],
	indigo: ['#1a2333', '#283f5e', '#4b6a90', '#8ea5bd', '#d2d8dc'],
	ochre: ['#2a2622', '#5a4a30', '#9a7a3e', '#c9a85f', '#e6dcc4']
} as const satisfies Record<string, Palette>;

// Long side 1200px. Ratios follow the real dimensions in docs/03 (width × height).
const SPECS: Spec[] = [
	{
		file: 'lotte-vanderzande-getijde-i',
		width: 960,
		height: 1200,
		style: 'bands',
		palette: PALETTES.tide,
		seed: 101
	},
	{
		file: 'lotte-vanderzande-getijde-ii',
		width: 960,
		height: 1200,
		style: 'bands',
		palette: PALETTES.dusk,
		seed: 102
	},
	{
		file: 'milan-okafor-peeters-stille-kamer',
		width: 1200,
		height: 1200,
		style: 'fields',
		palette: PALETTES.clay,
		seed: 203
	},
	{
		file: 'milan-okafor-peeters-noordlicht-oostende',
		width: 1200,
		height: 900,
		style: 'fields',
		palette: PALETTES.moss,
		seed: 204
	},
	{
		file: 'ines-marrot-fragment-12',
		width: 857,
		height: 1200,
		style: 'collage',
		palette: PALETTES.rust,
		seed: 305
	},
	{
		file: 'ines-marrot-fragment-19',
		width: 857,
		height: 1200,
		style: 'collage',
		palette: PALETTES.dusk,
		seed: 306
	},
	{
		file: 'ward-stoffels-zonder-titel-blauw',
		width: 840,
		height: 1200,
		style: 'concentric',
		palette: PALETTES.indigo,
		seed: 407
	},
	{
		file: 'ward-stoffels-raster-3',
		width: 1200,
		height: 1200,
		style: 'grid',
		palette: PALETTES.ochre,
		seed: 408
	},
	{
		file: 'yuna-breckx-hoogwater',
		width: 600,
		height: 1200,
		style: 'gradient',
		palette: PALETTES.indigo,
		seed: 509
	},
	{
		file: 'yuna-breckx-laagwater',
		width: 1200,
		height: 600,
		style: 'gradient',
		palette: PALETTES.tide,
		seed: 510
	},
	{
		file: 'lotte-vanderzande-getijde-iii',
		width: 800,
		height: 1200,
		style: 'bands',
		palette: PALETTES.tide,
		seed: 111
	}
];

/** mulberry32: tiny, fast, deterministic PRNG. */
function mulberry32(seed: number): Rng {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const between = (rng: Rng, min: number, max: number) => min + rng() * (max - min);
const pick = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)];
const r = (n: number) => Math.round(n * 10) / 10;

/** Horizontal soft-edged bands, like layers of water and sand. */
function bands(rng: Rng, w: number, h: number, p: Palette): string {
	let out = `<rect width="${w}" height="${h}" fill="${p[0]}"/>`;
	let y = 0;
	while (y < h) {
		const bandH = between(rng, h * 0.06, h * 0.22);
		const tilt = between(rng, -h * 0.02, h * 0.02);
		const colour = pick(rng, p.slice(1));
		out += `<path d="M0 ${r(y)} L${w} ${r(y + tilt)} L${w} ${r(y + tilt + bandH)} L0 ${r(y + bandH)} Z" fill="${colour}" opacity="${r(between(rng, 0.55, 0.95))}" filter="url(#soft)"/>`;
		y += bandH * between(rng, 0.7, 1);
	}
	return out;
}

/** Hard-edged, asymmetric colour blocks: an unequal split, one offset block and a thin rule. */
function fields(rng: Rng, w: number, h: number, p: Palette): string {
	const split = w * between(rng, 0.3, 0.42);
	let out = `<rect width="${w}" height="${h}" fill="${p[1]}"/>`;
	out += `<rect x="${r(split)}" width="${r(w - split)}" height="${h}" fill="${p[3]}"/>`;
	const bw = w * between(rng, 0.22, 0.32);
	const bh = h * between(rng, 0.3, 0.45);
	const bx = split - bw * between(rng, 0.3, 0.6);
	const by = h * between(rng, 0.15, 0.4);
	out += `<rect x="${r(bx)}" y="${r(by)}" width="${r(bw)}" height="${r(bh)}" fill="${p[0]}"/>`;
	out += `<rect x="${r(bx + bw * 0.25)}" y="${r(by + bh)}" width="${r(bw * 0.5)}" height="${r(h * 0.08)}" fill="${p[4]}"/>`;
	const ruleY = h * between(rng, 0.72, 0.86);
	out += `<rect x="${r(split)}" y="${r(ruleY)}" width="${r(w - split)}" height="${r(Math.max(2, h * 0.004))}" fill="${p[0]}" opacity="0.7"/>`;
	return out;
}

/** Overlapping rotated paper fragments. */
function collage(rng: Rng, w: number, h: number, p: Palette): string {
	let out = `<rect width="${w}" height="${h}" fill="${p[4]}"/>`;
	for (let i = 0; i < 9; i++) {
		const fw = between(rng, w * 0.18, w * 0.55);
		const fh = between(rng, h * 0.08, h * 0.35);
		const x = between(rng, -fw * 0.2, w - fw * 0.8);
		const y = between(rng, -fh * 0.2, h - fh * 0.8);
		const angle = between(rng, -14, 14);
		const colour = pick(rng, p.slice(0, 4));
		out += `<rect x="${r(x)}" y="${r(y)}" width="${r(fw)}" height="${r(fh)}" fill="${colour}" opacity="${r(between(rng, 0.65, 0.9))}" transform="rotate(${r(angle)} ${r(x + fw / 2)} ${r(y + fh / 2)})" style="mix-blend-mode:multiply"/>`;
	}
	// A few thin drawn lines across the fragments.
	for (let i = 0; i < 3; i++) {
		const y = between(rng, h * 0.1, h * 0.9);
		out += `<line x1="0" y1="${r(y)}" x2="${w}" y2="${r(y + between(rng, -h * 0.1, h * 0.1))}" stroke="${p[0]}" stroke-width="${r(between(rng, 1, 3))}" opacity="0.6"/>`;
	}
	return out;
}

/** Concentric circles, slightly off-register like a screenprint. */
function concentric(rng: Rng, w: number, h: number, p: Palette): string {
	let out = `<rect width="${w}" height="${h}" fill="${p[4]}"/>`;
	const maxR = Math.min(w, h) * 0.38;
	const cx = w / 2 + between(rng, -1, 1) * (w / 2 - maxR - 12);
	const cy = h * between(rng, 0.38, 0.5);
	const rings = 7;
	for (let i = 0; i < rings; i++) {
		const radius = maxR * (1 - i / rings);
		const colour = p[i % 4];
		const dx = between(rng, -6, 6);
		const dy = between(rng, -6, 6);
		out += `<circle cx="${r(cx + dx)}" cy="${r(cy + dy)}" r="${r(radius)}" fill="${colour}" opacity="${r(between(rng, 0.8, 1))}"/>`;
	}
	return out;
}

/** A raster of squares and dots with occasional gaps and misregistration. */
function grid(rng: Rng, w: number, h: number, p: Palette): string {
	let out = `<rect width="${w}" height="${h}" fill="${p[4]}"/>`;
	const cols = 8;
	const margin = w * 0.08;
	const cell = (w - margin * 2) / cols;
	const rows = Math.floor((h - margin * 2) / cell);
	const offsetY = (h - rows * cell) / 2;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (rng() < 0.12) continue;
			const x = margin + col * cell;
			const y = offsetY + row * cell;
			const colour = pick(rng, p.slice(0, 4));
			const inset = cell * between(rng, 0.12, 0.2);
			const shift = between(rng, -3, 3);
			out +=
				rng() < 0.35
					? `<circle cx="${r(x + cell / 2 + shift)}" cy="${r(y + cell / 2)}" r="${r(cell / 2 - inset)}" fill="${colour}"/>`
					: `<rect x="${r(x + inset + shift)}" y="${r(y + inset)}" width="${r(cell - inset * 2)}" height="${r(cell - inset * 2)}" fill="${colour}"/>`;
		}
	}
	return out;
}

function hexToRgb(hex: string): [number, number, number] {
	const n = parseInt(hex.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number): string {
	const [ar, ag, ab] = hexToRgb(a);
	const [br, bg, bb] = hexToRgb(b);
	const c = (x: number, y: number) => Math.round(x + (y - x) * t);
	return `rgb(${c(ar, br)} ${c(ag, bg)} ${c(ab, bb)})`;
}

/** A posterised gradient: visible stepped horizontal bands, dark to light and back. Clearly generated. */
function gradient(rng: Rng, w: number, h: number, p: Palette): string {
	const steps = 9 + Math.floor(rng() * 5);
	const peak = Math.floor(steps * between(rng, 0.45, 0.65));
	const weights = Array.from({ length: steps }, () => between(rng, 0.7, 1.3));
	const totalWeight = weights.reduce((a, b) => a + b, 0);
	let out = '';
	let pos = 0;
	for (let i = 0; i < steps; i++) {
		const size = (weights[i] / totalWeight) * h;
		const t = i <= peak ? i / peak : 1 - (i - peak) / (steps - 1 - peak);
		const colour = t < 0.5 ? mix(p[0], p[2], t * 2) : mix(p[2], p[4], (t - 0.5) * 2);
		out += `<rect x="0" y="${r(pos)}" width="${w}" height="${r(size + 1)}" fill="${colour}"/>`;
		pos += size;
	}
	return out;
}

const STYLES: Record<Style, (rng: Rng, w: number, h: number, p: Palette) => string> = {
	bands,
	fields,
	collage,
	concentric,
	grid,
	gradient
};

function render(spec: Spec): string {
	const rng = mulberry32(spec.seed);
	const { width: w, height: h } = spec;
	const blur = r(Math.min(w, h) * 0.006);
	const body = STYLES[spec.style](rng, w, h, spec.palette);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${blur}"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${spec.seed}" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/>
</filter>
</defs>
${body}
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.09" style="mix-blend-mode:overlay"/>
</svg>
`;
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', 'placeholders');
mkdirSync(outDir, { recursive: true });
for (const spec of SPECS) {
	writeFileSync(join(outDir, `${spec.file}.svg`), render(spec));
}
console.log(`Wrote ${SPECS.length} placeholders to static/placeholders/`);
