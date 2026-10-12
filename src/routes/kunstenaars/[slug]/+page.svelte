<!-- Artist page: built in Task 7 (docs/04 section 4). Temporary stub. -->
<script lang="ts">
	import { config } from '#lib/config.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.artist.name} — {config.brandName}</title>
</svelte:head>

<div class="shell py-16">
	<h1 class="type-h1">{data.artist.name}</h1>
</div>
