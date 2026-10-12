<!-- Catalogue (docs/04 section 2). All filter, sort and search state lives in the URL. -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { t, plural } from '#lib/i18n/index.js';
	import { config } from '#lib/config.js';
	import { LIMITS, sanitizeText } from '#lib/utils/input.js';
	import { artworks, getFeatured } from '#lib/data/artworks.js';
	import { artists, getArtist } from '#lib/data/artists.js';
	import {
		EMPTY_FILTERS,
		SORTS,
		TECHNIQUE_GROUPS,
		activeFilterCount,
		getTechniqueGroup,
		filterWorks,
		parseFilters,
		serializeFilters,
		sortWorks,
		type Filters,
		type SortKey
	} from '#lib/utils/catalogue.js';
	import ArtworkTile from '#lib/components/ArtworkTile.svelte';
	import FilterPanel from '#lib/components/FilterPanel.svelte';
	import Button from '#lib/components/Button.svelte';
	import CloseIcon from '#lib/components/CloseIcon.svelte';
	import CollectionHero from '#lib/components/hero/CollectionHero.svelte';

	// Hero wall: the featured works first, then the rest of the collection.
	const heroWorks = [...getFeatured(), ...artworks].filter(
		(work, i, all) => all.indexOf(work) === i
	);
	const heroTechniques = TECHNIQUE_GROUPS.map((group) => ({
		key: group.key,
		param: group.param,
		label: t(`catalogue.technique.${group.key}`),
		count: artworks.filter((w) => getTechniqueGroup(w) === group.key).length
	}));

	// The page is prerendered without a query string, so the URL can only be read in the browser.
	// Until mount we render the unfiltered collection, exactly like the prerendered HTML.
	let mounted = $state(false);
	onMount(() => (mounted = true));

	const filters = $derived(mounted ? parseFilters(page.url.searchParams) : EMPTY_FILTERS);
	const results = $derived(sortWorks(filterWorks(artworks, filters), filters.sort));
	const activeCount = $derived(activeFilterCount(filters));
	const countLabel = $derived(
		plural(results.length, 'catalogue.resultCountOne', 'catalogue.resultCount')
	);

	/**
	 * Writes a filter state to the URL. Checkbox and sort changes push a history entry so the back
	 * button steps through them; search typing replaces it.
	 */
	function navigate(next: Filters, replace = false) {
		const qs = serializeFilters(next);
		goto(qs ? resolve(`/collectie?${qs}`) : resolve('/collectie'), {
			replace,
			// Keep scroll position and focus (e.g. in the search field or on a checkbox).
			reset: false
		});
	}

	function clearAll() {
		navigate({ ...EMPTY_FILTERS, sort: filters.sort });
	}

	// Search field: local while typing, synced from the URL (e.g. the header search, back button).
	let query = $state('');
	let searchInput = $state<HTMLInputElement>();
	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		const q = filters.q;
		if (document.activeElement !== searchInput) query = q;
	});

	function onSearchInput() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(
			() => navigate({ ...filters, q: sanitizeText(query, LIMITS.search) }, true),
			250
		);
	}

	// Removable chips for every active filter.
	const chips = $derived.by(() => {
		const f = filters;
		return [
			...f.status.map((s) => ({
				id: `status-${s}`,
				label: t(`catalogue.status.${s}`),
				next: { ...f, status: f.status.filter((x) => x !== s) }
			})),
			...f.artist.map((slug) => ({
				id: `artist-${slug}`,
				label: getArtist(slug)?.name ?? slug,
				next: { ...f, artist: f.artist.filter((x) => x !== slug) }
			})),
			...f.technique.map((key) => ({
				id: `technique-${key}`,
				label: t(`catalogue.technique.${key}`),
				next: { ...f, technique: f.technique.filter((x) => x !== key) }
			})),
			...f.size.map((key) => ({
				id: `size-${key}`,
				label: t(`catalogue.size.${key}`),
				next: { ...f, size: f.size.filter((x) => x !== key) }
			})),
			...f.orientation.map((key) => ({
				id: `orientation-${key}`,
				label: t(`catalogue.orientation.${key}`),
				next: { ...f, orientation: f.orientation.filter((x) => x !== key) }
			})),
			...(f.min !== undefined
				? [
						{
							id: 'min',
							label: `${t('catalogue.priceMin')} ${f.min.toLocaleString(config.locale)}`,
							next: { ...f, min: undefined }
						}
					]
				: []),
			...(f.max !== undefined
				? [
						{
							id: 'max',
							label: `${t('catalogue.priceMax')} ${f.max.toLocaleString(config.locale)}`,
							next: { ...f, max: undefined }
						}
					]
				: [])
		];
	});

	const QUICK_STATUSES = ['veiling', 'te-koop', 'op-aanvraag'] as const;

	// Mobile filter sheet: a native modal <dialog> traps focus and closes on Esc.
	let sheet = $state<HTMLDialogElement>();
</script>

<svelte:head>
	<title>{t('meta.collectionTitle')}</title>
	<meta name="description" content={t('brand.footerLine')} />
</svelte:head>

<CollectionHero works={heroWorks} artistCount={artists.length} techniques={heroTechniques} />

<div class="shell pt-8 md:pt-12">
	<header class="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
		<p class="type-h3 tabular-nums" aria-live="polite">{countLabel}</p>

		<div class="flex w-full flex-wrap items-end gap-3 md:w-auto">
			<label class="w-full md:w-72">
				<span class="sr-only">{t('catalogue.searchLabel')}</span>
				<input
					bind:this={searchInput}
					bind:value={query}
					oninput={onSearchInput}
					type="search"
					maxlength={LIMITS.search}
					placeholder={t('nav.searchPlaceholder')}
					class="block h-11 w-full rounded-full border border-line bg-canvas px-4 text-ink placeholder:text-muted hover:border-muted"
				/>
			</label>

			<label class="flex flex-1 items-center gap-3 md:flex-none">
				<span class="type-small whitespace-nowrap text-muted">{t('catalogue.sortLabel')}</span>
				<select
					value={filters.sort}
					onchange={(e) => navigate({ ...filters, sort: e.currentTarget.value as SortKey })}
					class="h-11 w-full rounded-full border border-line bg-canvas px-4 font-semibold text-ink hover:border-muted md:w-auto"
				>
					{#each SORTS as sort (sort.key)}
						<option value={sort.key}>{t(`catalogue.sort.${sort.key}`)}</option>
					{/each}
				</select>
			</label>

			<button
				type="button"
				class="inline-flex h-11 items-center gap-2 rounded-full border border-ink px-4 font-semibold lg:hidden"
				aria-haspopup="dialog"
				onclick={() => sheet?.showModal()}
			>
				{t('catalogue.filters')}
				{#if activeCount}
					<span class="tabular-nums">({activeCount})</span>
				{/if}
			</button>
		</div>
	</header>

	<!-- Quick status filters, as pills -->
	<ul
		class="-mx-gutter mt-6 no-scrollbar flex gap-2 overflow-x-auto border-b border-line px-gutter pb-5 lg:mx-0 lg:px-0"
	>
		{#each QUICK_STATUSES as status (status)}
			{@const on = filters.status.includes(status)}
			<li>
				<button
					type="button"
					aria-pressed={on}
					class="inline-flex min-h-10 items-center rounded-full border px-4 font-semibold whitespace-nowrap transition-colors {on
						? 'border-ink bg-ink text-canvas'
						: 'border-line bg-canvas text-ink hover:border-ink'}"
					onclick={() =>
						navigate({
							...filters,
							status: on ? filters.status.filter((s) => s !== status) : [...filters.status, status]
						})}
				>
					{t(`catalogue.status.${status}`)}
				</button>
			</li>
		{/each}
	</ul>

	<div class="mt-8 lg:grid lg:grid-cols-[var(--container-sidebar)_minmax(0,1fr)] lg:gap-12">
		<!-- Desktop: sticky sidebar -->
		<aside
			class="sticky top-36 hidden max-h-[calc(100dvh-10rem)] self-start overflow-y-auto pr-2 lg:block"
			aria-label={t('catalogue.filters')}
		>
			<FilterPanel works={artworks} {filters} onchange={(next) => navigate(next)} />
		</aside>

		<div>
			{#if chips.length}
				<div class="mb-8 flex flex-wrap items-center gap-2">
					<ul class="contents">
						{#each chips as chip (chip.id)}
							<li>
								<button
									type="button"
									class="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-tint py-1 pr-3 pl-4 type-small font-semibold text-brand hover:bg-brand hover:text-canvas"
									aria-label={t('catalogue.removeFilter', { name: chip.label })}
									onclick={() => navigate(chip.next)}
								>
									{chip.label}
									<CloseIcon size={12} />
								</button>
							</li>
						{/each}
					</ul>
					<button
						type="button"
						class="ml-1 min-h-11 px-1 type-small font-semibold text-brand underline underline-offset-4 hover:text-brand-strong"
						onclick={clearAll}
					>
						{t('catalogue.clearAll')}
					</button>
				</div>
			{/if}

			{#if results.length}
				<ul class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
					{#each results as artwork, i (artwork.id)}
						<li>
							<ArtworkTile {artwork} headingLevel="h2" loading={i < 6 ? 'eager' : 'lazy'} />
						</li>
					{/each}
				</ul>
			{:else}
				<div class="rounded-card bg-surface p-8 text-center ring-1 ring-line ring-inset md:p-14">
					<p class="type-h3">{t('catalogue.empty')}</p>
					<Button variant="secondary" class="mt-6" onclick={clearAll}>
						{t('catalogue.clearAllFilters')}
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Mobile: bottom sheet -->
<dialog
	bind:this={sheet}
	aria-labelledby="filter-sheet-title"
	class="inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none flex-col rounded-t-card bg-canvas p-0 text-ink backdrop:bg-night/50 open:flex lg:hidden"
>
	<div class="flex items-center justify-between border-b border-line px-gutter py-3">
		<h2 id="filter-sheet-title" class="type-h3">{t('catalogue.filters')}</h2>
		<button
			type="button"
			class="-mr-2 grid size-11 place-items-center rounded-control"
			aria-label={t('nav.close')}
			onclick={() => sheet?.close()}
		>
			<CloseIcon size={18} />
		</button>
	</div>
	<div class="flex-1 overflow-y-auto px-gutter py-5">
		<FilterPanel works={artworks} {filters} onchange={(next) => navigate(next)} />
	</div>
	<div class="grid grid-cols-2 gap-3 border-t border-line px-gutter py-4">
		<Button variant="secondary" onclick={clearAll}>{t('catalogue.clearAll')}</Button>
		<Button onclick={() => sheet?.close()}>
			{t('catalogue.showResults', { count: results.length })}
		</Button>
	</div>
</dialog>
