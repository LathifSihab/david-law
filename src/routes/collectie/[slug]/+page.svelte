<!-- Artwork detail: built in Task 6 (docs/04 section 3). Temporary stub. -->
<script lang="ts">
	import { config } from '#lib/config.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.artwork.title} — {config.brandName}</title>
</svelte:head>

<div class="shell py-16">
	<h1 class="type-h1">{data.artwork.title}</h1>
</div>
