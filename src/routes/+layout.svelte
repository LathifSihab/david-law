<script lang="ts">
	import '@fontsource-variable/bodoni-moda/opsz.css';
	import '@fontsource-variable/bodoni-moda/opsz-italic.css';
	import '@fontsource-variable/schibsted-grotesk/wght.css';
	import '../app.css';
	// Preloaded so text doesn't reflow when the webfonts arrive (Lighthouse CLS). Same hashed files
	// the @font-face rules use; only the Latin subsets are ever needed for Dutch copy.
	import bodoniLatin from '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2?url';
	import schibstedLatin from '@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2?url';
	import { config } from '#lib/config.js';
	import { t } from '#lib/i18n/index.js';
	import DemoBanner from '#lib/components/DemoBanner.svelte';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="preload" href={bodoniLatin} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={schibstedLatin} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#ffffff" />
	<!-- Link previews (WhatsApp, Slack, mail). The shared link is the home page, so these are site-wide. -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={config.brandName} />
	<meta property="og:locale" content="nl_BE" />
	<meta property="og:title" content={t('meta.homeTitle')} />
	<meta property="og:description" content={t('meta.homeDescription')} />
	<meta property="og:url" content={config.siteUrl} />
	<meta property="og:image" content="{config.siteUrl}/og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={t('meta.homeTitle')} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
	href="#content"
	class="sr-only z-60 rounded-control bg-brand px-4 py-3 font-semibold text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
>
	{t('nav.skipToContent')}
</a>

<div class="flex min-h-dvh flex-col">
	<DemoBanner />
	<SiteHeader />

	<main id="content" tabindex="-1" class="flex-1 pb-section outline-none">
		{@render children()}
	</main>

	<SiteFooter />
</div>
<Toast />
