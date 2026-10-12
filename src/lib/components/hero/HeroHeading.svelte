<!-- Shared text block of the index-page heroes: eyebrow, serif headline with an italic accent,
     intro. Colours come from the hero around it (currentColor, `muted` and `accent` classes). -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		eyebrow: string;
		title: string;
		accent?: string;
		intro: string;
		/** Text classes for the eyebrow and intro. */
		muted: string;
		/** Text classes for the italic accent. */
		accentClass: string;
		/** Pulsing live dot instead of the rule before the eyebrow. */
		live?: boolean;
		children?: Snippet;
	}

	let {
		id,
		eyebrow,
		title,
		accent,
		intro,
		muted,
		accentClass,
		live = false,
		children
	}: Props = $props();
</script>

<p class="enter flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase {muted}">
	{#if live}
		<span class="relative flex size-2" aria-hidden="true">
			<span class="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-75"
			></span>
			<span class="relative inline-flex size-2 rounded-full bg-live"></span>
		</span>
	{:else}
		<span class="h-px w-8 bg-current" aria-hidden="true"></span>
	{/if}
	{eyebrow}
</p>

<h1 {id} class="enter mt-5 max-w-[14ch] type-hero" style="--enter-delay: 90ms">
	{title}
	{#if accent}<em class={accentClass}>{accent}</em>{/if}
</h1>

<p class="enter mt-5 max-w-[44ch] {muted}" style="--enter-delay: 180ms">{intro}</p>

{#if children}
	<div class="enter mt-8" style="--enter-delay: 270ms">{@render children()}</div>
{/if}
