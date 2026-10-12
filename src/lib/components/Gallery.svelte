<!--
	Detail-page gallery (docs/02): main image in a SpotlightFrame with a thumbnail strip.
	Thumbnails respond to click, arrow keys and swipe; the main image opens a lightbox
	(native modal <dialog>: focus is trapped, Esc closes, arrow keys navigate).
-->
<script lang="ts">
	import type { ArtworkImage } from '#lib/types.js';
	import { t } from '#lib/i18n/index.js';
	import SpotlightFrame from './SpotlightFrame.svelte';
	import DemoBadge from './DemoBadge.svelte';
	import CloseIcon from './CloseIcon.svelte';

	interface Props {
		images: ArtworkImage[];
		isDemo?: boolean;
	}

	let { images, isDemo = false }: Props = $props();

	let active = $state(0);
	const current = $derived(images[active]);
	const total = $derived(images.length);
	const counter = $derived(t('artwork.galleryImageOf', { n: active + 1, total }));

	/** Never upscale a supplied image beyond 1.25× its intrinsic size (docs/03 note on low-res files). */
	const cap = (image: ArtworkImage, viewport: string) =>
		`max-height: min(${viewport}, ${Math.round(image.height * 1.25)}px); max-width: min(100%, ${Math.round(image.width * 1.25)}px)`;

	function go(delta: number) {
		active = (active + delta + total) % total;
	}

	// Thumbnails: roving tabindex, so the strip is one tab stop and arrow keys move within it.
	let thumbs = $state<HTMLButtonElement[]>([]);

	function onThumbKeydown(event: KeyboardEvent) {
		const keys: Record<string, number> = {
			ArrowRight: active + 1,
			ArrowDown: active + 1,
			ArrowLeft: active - 1,
			ArrowUp: active - 1,
			Home: 0,
			End: total - 1
		};
		if (!(event.key in keys)) return;
		event.preventDefault();
		active = (keys[event.key] + total) % total;
		thumbs[active]?.focus();
	}

	// Swipe: a horizontal drag of more than 40px changes image instead of clicking.
	let swipeStart: number | null = null;
	let swiped = false;

	function onPointerDown(event: PointerEvent) {
		swipeStart = event.clientX;
		swiped = false;
	}

	function onPointerUp(event: PointerEvent) {
		if (swipeStart === null || total < 2) return;
		const dx = event.clientX - swipeStart;
		swipeStart = null;
		if (Math.abs(dx) > 40) {
			swiped = true;
			go(dx < 0 ? 1 : -1);
		}
	}

	// Lightbox
	let lightbox = $state<HTMLDialogElement>();
	let opener = $state<HTMLButtonElement>();

	function openLightbox() {
		if (swiped) return; // the pointerup that ended a swipe also fires a click
		lightbox?.showModal();
	}

	function onLightboxKeydown(event: KeyboardEvent) {
		if (total < 2) return;
		if (event.key === 'ArrowRight') go(1);
		if (event.key === 'ArrowLeft') go(-1);
	}
</script>

<div>
	<SpotlightFrame class="min-h-[min(72vh,620px)]">
		<button
			bind:this={opener}
			type="button"
			class="relative block cursor-zoom-in touch-pan-y"
			aria-label="{t('artwork.galleryOpen')}: {current.alt}"
			onclick={openLightbox}
			onpointerdown={onPointerDown}
			onpointerup={onPointerUp}
		>
			<img
				src={current.src}
				width={current.width}
				height={current.height}
				alt={current.alt}
				fetchpriority={active === 0 ? 'high' : 'auto'}
				decoding="async"
				draggable="false"
				class="block h-auto w-auto select-none"
				style={cap(current, '62vh')}
			/>
			{#if isDemo}
				<DemoBadge class="absolute top-2 left-2" />
			{/if}
		</button>
	</SpotlightFrame>

	{#if total > 1}
		<div class="mt-4 flex items-center justify-between gap-4">
			<ul class="flex gap-3 overflow-x-auto pb-1">
				{#each images as image, i (image.src)}
					<li class="shrink-0">
						<button
							bind:this={thumbs[i]}
							type="button"
							tabindex={i === active ? 0 : -1}
							aria-current={i === active ? 'true' : undefined}
							aria-label={t('artwork.galleryImageOf', { n: i + 1, total })}
							class="block p-1 opacity-60 transition-opacity hover:opacity-100 aria-current:opacity-100 aria-current:outline aria-current:outline-paper"
							onclick={() => (active = i)}
							onkeydown={onThumbKeydown}
						>
							<img
								src={image.thumb}
								width={image.width}
								height={image.height}
								alt=""
								loading="lazy"
								decoding="async"
								class="block h-16 w-auto"
							/>
						</button>
					</li>
				{/each}
			</ul>
			<p class="shrink-0 type-small text-aluminium tabular-nums" aria-live="polite">{counter}</p>
		</div>
	{/if}
</div>

<dialog
	bind:this={lightbox}
	aria-label={counter}
	class="m-0 h-dvh max-h-none w-full max-w-none bg-wall-deep p-0 text-paper backdrop:bg-wall-deep open:grid"
	onkeydown={onLightboxKeydown}
	onclose={() => opener?.focus()}
>
	<div class="grid h-full grid-rows-[auto_minmax(0,1fr)]">
		<div class="flex items-center justify-between px-gutter py-3">
			<p class="type-small text-aluminium tabular-nums">{counter}</p>
			<button
				type="button"
				class="-mr-2 grid size-11 place-items-center rounded-control"
				aria-label={t('artwork.galleryClose')}
				onclick={() => lightbox?.close()}
			>
				<CloseIcon size={20} />
			</button>
		</div>

		<div class="flex min-h-0 items-center justify-center gap-2 px-2 pb-6 sm:gap-6 sm:px-6">
			{#if total > 1}
				<button
					type="button"
					class="grid size-11 shrink-0 place-items-center rounded-control text-aluminium hover:text-paper"
					aria-label={t('artwork.galleryPrev')}
					onclick={() => go(-1)}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"><path d="M12.5 4l-6 6 6 6" /></svg
					>
				</button>
			{/if}

			<img
				src={current.src}
				width={current.width}
				height={current.height}
				alt={current.alt}
				decoding="async"
				draggable="false"
				class="block h-auto w-auto min-w-0 select-none"
				style={cap(current, 'calc(100dvh - 7rem)')}
				onpointerdown={onPointerDown}
				onpointerup={onPointerUp}
			/>

			{#if total > 1}
				<button
					type="button"
					class="grid size-11 shrink-0 place-items-center rounded-control text-aluminium hover:text-paper"
					aria-label={t('artwork.galleryNext')}
					onclick={() => go(1)}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"><path d="M7.5 4l6 6-6 6" /></svg
					>
				</button>
			{/if}
		</div>
	</div>
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
