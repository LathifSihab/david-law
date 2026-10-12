<script lang="ts">
	import '@fontsource-variable/bodoni-moda/opsz.css';
	import '@fontsource-variable/bodoni-moda/opsz-italic.css';
	import '@fontsource-variable/schibsted-grotesk/wght.css';
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { t } from '#lib/i18n/index.js';
	import DemoBanner from '#lib/components/DemoBanner.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#content"
	class="sr-only z-60 rounded-control bg-paper px-4 py-3 font-medium text-wall focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
>
	{t('nav.skipToContent')}
</a>

<div class="flex min-h-dvh flex-col">
	<DemoBanner />
	<SiteHeader />

	<main id="content" tabindex="-1" class="flex-1 pb-(--spacing-section) outline-none">
		{@render children()}
	</main>

	<SiteFooter />
</div>
<Toast />
