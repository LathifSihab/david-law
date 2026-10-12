<!--
	Catalogue filters (docs/04 section 2). Used twice: the desktop sidebar and the mobile sheet.
	Counts are facet counts: how many works you'd see with that box ticked, given the other filters.
-->
<script lang="ts">
	import type { Artwork, ArtworkStatus } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import { artists } from '#lib/data/artists.js';
	import {
		ORIENTATIONS,
		SIZE_GROUPS,
		STATUSES,
		TECHNIQUE_GROUPS,
		facetCounts,
		getOrientation,
		getSizeGroup,
		getTechniqueGroup,
		surnameKey,
		type Filters
	} from '#lib/utils/catalogue.js';
	import { parseAmount, sanitizeAmountInput } from '#lib/utils/input.js';

	interface Props {
		works: Artwork[];
		filters: Filters;
		onchange: (next: Filters) => void;
	}

	let { works, filters, onchange }: Props = $props();

	const sortedArtists = [...artists].sort((a, b) =>
		surnameKey(a.name).localeCompare(surnameKey(b.name), 'nl')
	);

	const counts = $derived({
		status: facetCounts(works, filters, 'status', (w) => w.status),
		artist: facetCounts(works, filters, 'artist', (w) => w.artistSlug),
		technique: facetCounts(works, filters, 'technique', getTechniqueGroup),
		size: facetCounts(works, filters, 'size', getSizeGroup),
		orientation: facetCounts(works, filters, 'orientation', getOrientation)
	});

	function toggle<K>(list: K[], key: K): K[] {
		return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
	}

	/** 500 → "500", 12.5 → "12,50" (Dutch decimal comma). */
	const toInput = (n: number | undefined) =>
		n === undefined ? '' : Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');

	/** Only digits and one decimal separator ever reach the field, typed or pasted. */
	function onPriceInput(event: Event & { currentTarget: HTMLInputElement }) {
		const field = event.currentTarget;
		const clean = sanitizeAmountInput(field.value);
		if (field.value !== clean) field.value = clean;
	}

	type Option = { key: string; label: string; count: number; checked: boolean; toggle: () => void };

	const groups = $derived<{ id: string; legend: string; options: Option[] }[]>([
		{
			id: 'status',
			legend: t('catalogue.groups.status'),
			options: STATUSES.map((s: ArtworkStatus) => ({
				key: s,
				label: t(`catalogue.status.${s}`),
				count: counts.status[s] ?? 0,
				checked: filters.status.includes(s),
				toggle: () => onchange({ ...filters, status: toggle(filters.status, s) })
			}))
		},
		{
			id: 'artist',
			legend: t('catalogue.groups.artist'),
			options: sortedArtists.map((a) => ({
				key: a.slug,
				label: a.name,
				count: counts.artist[a.slug] ?? 0,
				checked: filters.artist.includes(a.slug),
				toggle: () => onchange({ ...filters, artist: toggle(filters.artist, a.slug) })
			}))
		},
		{
			id: 'technique',
			legend: t('catalogue.groups.technique'),
			options: TECHNIQUE_GROUPS.map(({ key }) => ({
				key,
				label: t(`catalogue.technique.${key}`),
				count: counts.technique[key] ?? 0,
				checked: filters.technique.includes(key),
				toggle: () => onchange({ ...filters, technique: toggle(filters.technique, key) })
			}))
		},
		{
			id: 'size',
			legend: t('catalogue.groups.size'),
			options: SIZE_GROUPS.map(({ key }) => ({
				key,
				label: t(`catalogue.size.${key}`),
				count: counts.size[key] ?? 0,
				checked: filters.size.includes(key),
				toggle: () => onchange({ ...filters, size: toggle(filters.size, key) })
			}))
		},
		{
			id: 'orientation',
			legend: t('catalogue.groups.orientation'),
			options: ORIENTATIONS.map(({ key }) => ({
				key,
				label: t(`catalogue.orientation.${key}`),
				count: counts.orientation[key] ?? 0,
				checked: filters.orientation.includes(key),
				toggle: () => onchange({ ...filters, orientation: toggle(filters.orientation, key) })
			}))
		}
	]);
</script>

<div class="divide-y divide-line">
	{#each groups as group (group.id)}
		<fieldset class="py-5 first:pt-0">
			<legend class="float-left mb-2 w-full font-semibold">{group.legend}</legend>
			<ul class="clear-left">
				{#each group.options as option (option.key)}
					{@const disabled = option.count === 0 && !option.checked}
					<li>
						<label
							class="flex min-h-11 cursor-pointer items-center gap-3"
							class:opacity-50={disabled}
							class:cursor-not-allowed={disabled}
						>
							<input
								type="checkbox"
								class="size-[18px] shrink-0 accent-brand"
								checked={option.checked}
								{disabled}
								onchange={option.toggle}
							/>
							<span class="flex-1">{option.label}</span>
							<span class="type-small text-muted tabular-nums">{option.count}</span>
						</label>
					</li>
				{/each}
			</ul>
		</fieldset>

		{#if group.id === 'technique'}
			<!-- Price sits between technique and size, as in docs/04 -->
			<fieldset class="py-5">
				<legend class="float-left mb-3 w-full font-semibold">{t('catalogue.groups.price')}</legend>
				<div class="clear-left grid grid-cols-2 gap-3">
					<label class="space-y-1.5">
						<span class="type-small text-muted">{t('catalogue.priceMin')}</span>
						<input
							type="text"
							inputmode="decimal"
							autocomplete="off"
							spellcheck="false"
							value={toInput(filters.min)}
							oninput={onPriceInput}
							onchange={(e) => onchange({ ...filters, min: parseAmount(e.currentTarget.value) })}
							class="block h-11 w-full rounded-control border border-line bg-canvas px-3 text-ink tabular-nums hover:border-muted"
						/>
					</label>
					<label class="space-y-1.5">
						<span class="type-small text-muted">{t('catalogue.priceMax')}</span>
						<input
							type="text"
							inputmode="decimal"
							autocomplete="off"
							spellcheck="false"
							value={toInput(filters.max)}
							oninput={onPriceInput}
							onchange={(e) => onchange({ ...filters, max: parseAmount(e.currentTarget.value) })}
							class="block h-11 w-full rounded-control border border-line bg-canvas px-3 text-ink tabular-nums hover:border-muted"
						/>
					</label>
				</div>
			</fieldset>
		{/if}
	{/each}
</div>
