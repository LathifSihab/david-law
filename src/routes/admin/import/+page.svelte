<!--
	Admin Excel import mock (docs/04 section 7). Shows how Carl's Excel file becomes the catalogue.
	The file is read in the browser only: no upload, no storage (docs/07). Not in the main navigation.
-->
<script lang="ts">
	import { t, plural } from '#lib/i18n/index.js';
	import { formatPrice } from '#lib/utils/format.js';
	import { sanitizeText } from '#lib/utils/input.js';
	import {
		MAX_FILE_BYTES,
		MAX_ROWS,
		hasAcceptedExtension,
		mapSheet,
		normaliseStatus,
		parsePrice,
		templateRows,
		type ImportResult,
		type Issue
	} from '#lib/utils/excel-import.js';
	import Button from '#lib/components/Button.svelte';
	import { toast } from '#lib/components/toasts.svelte.js';

	const PREVIEW_ROWS = 20;

	let result = $state<ImportResult | null>(null);
	let error = $state('');
	let fileName = $state('');
	let dragging = $state(false);

	const okCount = $derived(result?.rows.filter((r) => r.issues.length === 0).length ?? 0);
	const warnCount = $derived(result?.rows.filter((r) => r.issues.length > 0).length ?? 0);
	// Without a title a row can't become a work; everything else imports with a warning.
	const importable = $derived(
		result?.rows.filter((r) => !r.issues.includes('missingTitle')).length ?? 0
	);

	// SheetJS is only loaded on this page, when it's actually needed.
	const loadSheetJs = () => import('xlsx');

	async function readFile(file: File | undefined) {
		if (!file) return;
		error = '';
		result = null;
		fileName = sanitizeText(file.name, 120);
		// Checked before reading a single byte: type by extension, then size.
		if (!hasAcceptedExtension(file.name)) {
			error = t('admin.errorRead');
			return;
		}
		if (file.size > MAX_FILE_BYTES) {
			error = t('admin.errorSize');
			return;
		}
		try {
			const XLSX = await loadSheetJs();
			// Values only: no formulas or HTML are parsed, and parsing stops after MAX_ROWS rows.
			// CSV is decoded as UTF-8 here: SheetJS would read a CSV without a byte-order mark as
			// Latin-1 and garble accents ("Inès" → "InÃ¨s").
			const isCsv = file.name.toLowerCase().endsWith('.csv');
			const workbook = XLSX.read(isCsv ? await file.text() : await file.arrayBuffer(), {
				type: isCsv ? 'string' : 'array',
				sheetRows: MAX_ROWS + 5,
				cellFormula: false,
				cellHTML: false
			});
			const sheet = workbook.Sheets[workbook.SheetNames[0]];
			if (!sheet) throw new Error('No sheets');
			const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
				header: 1,
				raw: false,
				defval: ''
			});
			const mapped = mapSheet(rows);
			if (!mapped) throw new Error('No catalogue columns');
			result = mapped;
		} catch {
			error = t('admin.errorRead');
		}
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		readFile(event.dataTransfer?.files[0]);
	}

	async function downloadTemplate() {
		const XLSX = await loadSheetJs();
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(templateRows()), 'Werken');
		XLSX.writeFile(workbook, 'kunstkamer-voorbeeldbestand.xlsx');
	}

	function runImport() {
		toast.show(
			importable === 1 ? t('demo.toastImportOne') : t('demo.toastImport', { count: importable })
		);
	}

	const issueLabel: Record<Issue, () => string> = {
		missingTitle: () => t('admin.missingTitle'),
		missingImage: () => t('admin.missingImage'),
		missingPrice: () => t('admin.missingPrice')
	};

	function priceCell(raw: string | undefined): string {
		const price = parsePrice(raw);
		return price === undefined ? '—' : formatPrice(price);
	}
</script>

<svelte:head>
	<title>{t('admin.title')}</title>
</svelte:head>

<div class="shell pt-10 md:pt-14">
	<h1 class="max-w-[22ch] type-h1">{t('admin.title')}</h1>
	<p class="mt-4 max-w-measure text-muted">{t('admin.intro')}</p>

	<div class="mt-8 flex flex-wrap gap-3">
		<Button variant="secondary" onclick={downloadTemplate}>{t('admin.template')}</Button>
	</div>

	<!-- Drop zone: a label for the (visually hidden) file input, so it also works by keyboard -->
	<label
		for="excel-file"
		class="mt-8 flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-focus {dragging
			? 'border-ink bg-surface'
			: 'border-muted/50 hover:border-ink'}"
		ondragover={(e) => {
			e.preventDefault();
			dragging = true;
		}}
		ondragleave={() => (dragging = false)}
		ondrop={onDrop}
	>
		<svg
			width="28"
			height="28"
			viewBox="0 0 28 28"
			fill="none"
			stroke="currentColor"
			stroke-width="1.25"
			class="text-muted"
			aria-hidden="true"
		>
			<path d="M14 18V5M9 10l5-5 5 5M5 18v4h18v-4" />
		</svg>
		<span class="font-medium">{t('admin.drop')}</span>
		<span class="type-small text-muted">.xlsx, .xls, .csv</span>
		<input
			id="excel-file"
			type="file"
			accept=".xlsx,.xls,.csv"
			class="sr-only"
			onchange={(e) => readFile(e.currentTarget.files?.[0])}
		/>
	</label>

	<div aria-live="polite">
		{#if error}
			<p class="mt-6 border border-ink bg-surface px-4 py-3" role="alert">{error}</p>
		{/if}

		{#if result}
			<div class="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
				<div>
					<p class="type-small text-muted">{t('admin.file', { name: fileName })}</p>
					<p class="mt-1 type-h2">
						{okCount === 1
							? t('admin.summaryOne', { warn: warnCount })
							: t('admin.summary', { ok: okCount, warn: warnCount })}
					</p>
					{#if result.ignored.length}
						<p class="mt-2 type-small text-muted">
							{t('admin.ignored', { names: result.ignored.join(', ') })}
						</p>
					{/if}
				</div>
				<Button onclick={runImport} disabled={importable === 0}>{t('admin.import')}</Button>
			</div>

			<h2 class="mt-8 type-h3">
				{t('admin.preview', { count: Math.min(PREVIEW_ROWS, result.rows.length) })}
			</h2>
			<div class="mt-4 overflow-x-auto">
				<table class="w-full min-w-4xl text-left type-small">
					<thead class="text-muted">
						<tr class="border-b border-line">
							<th scope="col" class="py-3 pr-4 font-normal">ID</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('artwork.spec.artist')}</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('artwork.spec.title')}</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('artwork.spec.year')}</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('artwork.spec.technique')}</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('artwork.spec.dimensions')}</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('catalogue.groups.price')}</th>
							<th scope="col" class="py-3 pr-4 font-normal">{t('catalogue.groups.status')}</th>
							<th scope="col" class="py-3 font-normal">{t('admin.check')}</th>
						</tr>
					</thead>
					<tbody>
						{#each result.rows.slice(0, PREVIEW_ROWS) as row, i (i)}
							{@const v = row.values}
							{@const status = normaliseStatus(v.status)}
							<tr class="border-b border-line align-top">
								<td class="py-3 pr-4 text-muted">{v.id ?? '—'}</td>
								<td class="py-3 pr-4">{v.artist ?? '—'}</td>
								<td class="py-3 pr-4 font-medium"><i>{v.title ?? '—'}</i></td>
								<td class="py-3 pr-4">{v.year ?? '—'}</td>
								<td class="py-3 pr-4">{v.technique ?? '—'}</td>
								<td class="py-3 pr-4 whitespace-nowrap">
									{v.widthCm && v.heightCm
										? t('artwork.dimensions', { w: v.widthCm, h: v.heightCm })
										: '—'}
								</td>
								<td class="py-3 pr-4 whitespace-nowrap">{priceCell(v.price)}</td>
								<td class="py-3 pr-4 whitespace-nowrap">
									{status === 'te-koop' ||
									status === 'veiling' ||
									status === 'verkocht' ||
									status === 'op-aanvraag'
										? t(`catalogue.status.${status}`)
										: (v.status ?? '—')}
								</td>
								<td class="py-3">
									<ul class="flex flex-wrap gap-1.5">
										{#if row.issues.length === 0}
											<li class="rounded-full border border-line px-2.5 py-0.5 text-muted">
												{t('admin.ok')}
											</li>
										{:else}
											{#each row.issues as issue (issue)}
												<li
													class="rounded-full border border-ink px-2.5 py-0.5 font-medium whitespace-nowrap"
												>
													{issueLabel[issue]()}
												</li>
											{/each}
										{/if}
									</ul>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="mt-4 type-small text-muted tabular-nums">
				{plural(result.rows.length, 'home.worksCountOne', 'home.worksCount')}
			</p>
		{/if}
	</div>
</div>
