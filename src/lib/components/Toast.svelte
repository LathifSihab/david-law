<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { t } from '#lib/i18n/index.js';
	import CloseIcon from './CloseIcon.svelte';
	import { toast } from './toasts.svelte.js';

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<!-- The live region is always in the DOM so screen readers pick up new messages. -->
<div
	role="status"
	aria-live="polite"
	class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
>
	{#each toast.items as item (item.id)}
		<div
			class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-control bg-night py-3 pr-2 pl-4 text-canvas shadow-raised"
			transition:fly={{ y: 12, duration }}
		>
			<p class="flex-1 py-1.5 type-small">{item.message}</p>
			<button
				type="button"
				class="grid size-9 shrink-0 place-items-center rounded-full text-night-muted hover:bg-canvas/10 hover:text-canvas"
				aria-label={t('nav.close')}
				onclick={() => toast.dismiss(item.id)}
			>
				<CloseIcon size={14} />
			</button>
		</div>
	{/each}
</div>
