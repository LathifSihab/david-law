<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '#lib/i18n/index.js';
	import Button from './Button.svelte';

	interface Props {
		/** The path that wasn't found; a missing artwork gets its own message. */
		pathname: string;
		/** 404 by default; anything else shows a generic error. */
		status?: number;
	}

	let { pathname, status = 404 }: Props = $props();

	const message = $derived(
		status !== 404
			? t('notFound.error')
			: pathname.startsWith('/collectie/')
				? t('notFound.work')
				: t('notFound.page')
	);
</script>

<svelte:head>
	<title>{t('notFound.title')}</title>
</svelte:head>

<div class="shell py-24">
	<p class="type-small text-aluminium tabular-nums">{status}</p>
	<h1 class="mt-2 max-w-[20ch] type-h1">{message}</h1>
	<Button href={resolve('/collectie')} class="mt-10">{t('notFound.back')}</Button>
</div>
