<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '#lib/i18n/index.js';
	import CloseIcon from './CloseIcon.svelte';

	interface Props {
		open: boolean;
		title: string;
		onclose?: () => void;
		children: Snippet;
		/** Action buttons, rendered at the bottom. */
		actions?: Snippet;
		class?: string;
	}

	let {
		open = $bindable(false),
		title,
		onclose,
		children,
		actions,
		class: className = ''
	}: Props = $props();

	const titleId = $props.id();
	let dialog: HTMLDialogElement;
	let returnFocusTo: HTMLElement | null = null;

	// Keep the native dialog in sync with `open`. showModal() traps focus and makes the rest inert.
	$effect(() => {
		if (open && !dialog.open) {
			returnFocusTo = document.activeElement as HTMLElement | null;
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	});

	// Fires for Esc, the close button and programmatic close alike.
	function handleClose() {
		open = false;
		returnFocusTo?.focus();
		returnFocusTo = null;
		onclose?.();
	}

	// A click on the backdrop lands on the <dialog> element itself.
	function handleClick(event: MouseEvent) {
		if (event.target === dialog) dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={titleId}
	onclose={handleClose}
	onclick={handleClick}
	class="m-auto w-[calc(100%-2rem)] max-w-lg rounded-card bg-canvas p-0 text-ink shadow-raised backdrop:bg-night/50 {className}"
>
	<div class="flex items-start justify-between gap-4 px-6 pt-6">
		<h2 id={titleId} class="type-h2">{title}</h2>
		<button
			type="button"
			class="-mt-2 -mr-3 grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
			aria-label={t('nav.close')}
			onclick={() => dialog.close()}
		>
			<CloseIcon />
		</button>
	</div>
	<div class="px-6 pt-4 pb-6">
		{@render children()}
	</div>
	{#if actions}
		<div class="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-4">
			{@render actions()}
		</div>
	{/if}
</dialog>

<style>
	dialog[open] {
		transition:
			opacity 200ms var(--ease-gallery),
			overlay 200ms allow-discrete,
			display 200ms allow-discrete;
		opacity: 1;
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
		}
	}
</style>
