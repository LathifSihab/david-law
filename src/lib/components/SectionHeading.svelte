<script lang="ts">
	import Button from './Button.svelte';

	interface Props {
		id: string;
		title: string;
		/** Optional text link on the right, e.g. "Alle veilingen". */
		href?: string;
		linkLabel?: string;
	}

	let { id, title, href, linkLabel }: Props = $props();
</script>

<div class="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 md:mb-10">
	<h2 {id} class="type-h2">{title}</h2>
	{#if href && linkLabel}
		<Button variant="link" {href}>{linkLabel}</Button>
	{/if}
</div>
