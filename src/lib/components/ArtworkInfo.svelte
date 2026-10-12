<!--
	"Over dit werk", "Specificaties" and "Over de kunstenaar" (docs/04).
	Shared by the artwork detail page and the auction lot page.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Artwork } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import { getArtist } from '#lib/data/artists.js';
	import { formatDimensions } from '#lib/utils/format.js';
	import Button from './Button.svelte';
	import DemoBadge from './DemoBadge.svelte';

	let { artwork }: { artwork: Artwork } = $props();

	const artist = $derived(getArtist(artwork.artistSlug));

	/** Specification rows; rows without a value are skipped (docs/04). */
	const specRows = $derived.by((): [string, string][] => {
		const a = artwork;
		const edition = a.edition
			? a.edition.label && a.edition.artistProofs
				? t('artwork.editionFull', {
						label: a.edition.label,
						size: a.edition.size,
						ap: a.edition.artistProofs
					})
				: a.edition.label
					? t('artwork.editionLabelled', { label: a.edition.label, size: a.edition.size })
					: t('artwork.editionSimple', { size: a.edition.size })
			: t('artwork.unique');
		const rows: [string, string | undefined][] = [
			[t('artwork.spec.artist'), artist?.name],
			[t('artwork.spec.title'), a.title],
			[t('artwork.spec.series'), a.series],
			[t('artwork.spec.year'), String(a.year)],
			[t('artwork.spec.technique'), a.technique],
			[t('artwork.spec.support'), a.support],
			[t('artwork.spec.dimensions'), formatDimensions(a)],
			[t('artwork.spec.edition'), edition],
			[
				t('artwork.spec.signed'),
				a.signed ? (a.signatureNote ?? t('artwork.spec.yes')) : t('artwork.spec.no')
			],
			[t('artwork.spec.certificate'), a.certificate ? t('artwork.spec.yes') : t('artwork.spec.no')]
		];
		return rows.filter((row): row is [string, string] => Boolean(row[1]));
	});
</script>

<div class="mt-section grid gap-12 border-t border-hairline pt-12 md:grid-cols-2 md:gap-16">
	<section aria-labelledby="about-work">
		<h2 id="about-work" class="type-h2">{t('artwork.aboutWork')}</h2>
		<p class="mt-5 max-w-measure">{artwork.description}</p>
		{#if artwork.details?.length}
			<ul class="mt-6 max-w-measure divide-y divide-hairline border-y border-hairline">
				{#each artwork.details as detail (detail)}
					<li class="py-3 text-aluminium">{detail}</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section aria-labelledby="specs">
		<h2 id="specs" class="type-h2">{t('artwork.specs')}</h2>
		<dl class="mt-5 divide-y divide-hairline border-y border-hairline">
			{#each specRows as [label, value] (label)}
				<div class="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 py-3">
					<dt class="text-aluminium">{label}</dt>
					<dd>{value}</dd>
				</div>
			{/each}
		</dl>
	</section>
</div>

{#if artist}
	<section class="mt-section" aria-labelledby="about-artist">
		<h2 id="about-artist" class="type-h2">{t('artwork.aboutArtist')}</h2>
		<div class="mt-5 flex flex-wrap items-center gap-3">
			<p class="type-h3">{artist.name}</p>
			{#if artist.isDemo}<DemoBadge kind="artist" />{/if}
		</div>
		<p class="mt-3 max-w-measure text-aluminium">{artist.shortBio}</p>
		<Button
			variant="link"
			href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
			class="mt-3"
		>
			{t('artwork.viewArtist', { name: artist.name })}
		</Button>
	</section>
{/if}
