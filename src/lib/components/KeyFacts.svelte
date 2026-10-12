<!--
	The facts a buyer checks first, right under the title in the purchase panel (as on a Catawiki
	lot), with a link down to the full specification table in ArtworkInfo.
-->
<script lang="ts">
	import type { Artwork } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import { formatDimensions, formatEdition } from '#lib/utils/format.js';

	let { artwork }: { artwork: Artwork } = $props();

	const facts = $derived(
		(
			[
				[t('artwork.spec.technique'), artwork.technique],
				[t('artwork.spec.dimensions'), formatDimensions(artwork)],
				[t('artwork.spec.edition'), formatEdition(artwork.edition)],
				[t('artwork.spec.condition'), artwork.condition]
			] as [string, string | undefined][]
		).filter((fact): fact is [string, string] => Boolean(fact[1]))
	);
</script>

<section class="mt-5" aria-labelledby="key-facts">
	<h2 id="key-facts" class="sr-only">{t('artwork.keyFacts')}</h2>
	<dl class="space-y-2 type-small">
		{#each facts as [label, value] (label)}
			<div class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
				<dt class="text-muted">{label}</dt>
				<dd>{value}</dd>
			</div>
		{/each}
	</dl>
	<a
		href="#specificaties"
		class="mt-3 inline-flex min-h-11 items-center type-small font-semibold text-brand underline-offset-4 hover:underline"
	>
		{t('artwork.allSpecs')}
	</a>
</section>
