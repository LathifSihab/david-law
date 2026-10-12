<script lang="ts">
	import '@fontsource-variable/bodoni-moda/opsz.css';
	import '@fontsource-variable/bodoni-moda/opsz-italic.css';
	import '@fontsource-variable/schibsted-grotesk/wght.css';
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
