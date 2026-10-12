import { nl } from './nl.js';

/** Same shape as `nl`, with any string values. A future `en.ts` is typed `const en: Dictionary`. */
type Widen<T> = T extends string
	? string
	: T extends readonly (infer U)[]
		? readonly Widen<U>[]
		: { readonly [K in keyof T]: Widen<T[K]> };
export type Dictionary = Widen<typeof nl>;

/** Dot paths to string leaves, e.g. 'catalogue.sort.newest'. */
type StringPaths<T, P extends string = ''> = {
	[K in keyof T & string]: T[K] extends string
		? `${P}${K}`
		: T[K] extends readonly unknown[]
			? never
			: StringPaths<T[K], `${P}${K}.`>;
}[keyof T & string];

/** Dot paths to string lists, e.g. 'home.about'. */
type ListPaths<T, P extends string = ''> = {
	[K in keyof T & string]: T[K] extends string
		? never
		: T[K] extends readonly string[]
			? `${P}${K}`
			: ListPaths<T[K], `${P}${K}.`>;
}[keyof T & string];

export type CopyKey = StringPaths<typeof nl>;
export type CopyListKey = ListPaths<typeof nl>;
export type Params = Record<string, string | number>;

const dictionary: Dictionary = nl;

function lookup(key: string): unknown {
	let node: unknown = dictionary;
	for (const part of key.split('.')) {
		if (node === null || typeof node !== 'object') return undefined;
		node = (node as Record<string, unknown>)[part];
	}
	return node;
}

function interpolate(text: string, params?: Params): string {
	if (!params) return text;
	return text.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match
	);
}

/** Translate a copy key. `{name}` placeholders are filled from `params`. */
export function t(key: CopyKey, params?: Params): string {
	const value = lookup(key);
	if (typeof value !== 'string') {
		if (import.meta.env.DEV) console.warn(`[i18n] Missing copy key: ${key}`);
		return key;
	}
	return interpolate(value, params);
}

/** A list of copy strings, e.g. paragraphs or numbered steps. */
export function tList(key: CopyListKey): readonly string[] {
	const value = lookup(key);
	if (!Array.isArray(value)) {
		if (import.meta.env.DEV) console.warn(`[i18n] Missing copy list: ${key}`);
		return [];
	}
	return value as readonly string[];
}

/** Picks the `one` key for a count of 1, otherwise `many` with `{count}` filled in. */
export function plural(count: number, one: CopyKey, many: CopyKey, params?: Params): string {
	return t(count === 1 ? one : many, { count, ...params });
}
