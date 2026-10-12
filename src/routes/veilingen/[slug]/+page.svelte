<!-- Auction lot: built in Task 8 (docs/04 section 6). Temporary stub. -->
<script lang="ts">
	import { config } from '#lib/config.js';
	import { t } from '#lib/i18n/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{t('auction.lot', { n: data.lot.lotNumber })} — {config.brandName}</title>
</svelte:head>

<div class="shell py-16">
	<p class="type-small text-aluminium">{t('auction.lot', { n: data.lot.lotNumber })}</p>
	<h1 class="type-h1">{data.artwork.title}</h1>
</div>
