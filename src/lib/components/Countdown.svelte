<script lang="ts">
	import { t } from '#lib/i18n/index.js';
	import { formatCountdown } from '#lib/utils/format.js';

	interface Props {
		/** End time as epoch milliseconds. */
		endsAt: number;
		/** Called once when the countdown reaches zero. */
		onend?: () => void;
		/** Wraps the time, e.g. (time) => t('auction.startsIn', { time }) for an upcoming lot. */
		template?: (time: string) => string;
		/** Amber means "this auction is running" (docs/02). Turn off for upcoming lots. */
		live?: boolean;
		class?: string;
	}

	let { endsAt, onend, template, live = true, class: className = '' }: Props = $props();

	// null until mounted: the server can't know the visitor's clock, so render "--" first.
	let now = $state<number | null>(null);

	$effect(() => {
		let timer: ReturnType<typeof setTimeout>;
		let ended = false;

		const tick = () => {
			// Local copy: reading `now` back here would make the effect depend on its own write.
			const current = Date.now();
			now = current;
			if (current >= endsAt) {
				if (!ended) {
					ended = true;
					onend?.();
				}
				return;
			}
			// Align to the next whole second so the display doesn't drift or skip.
			timer = setTimeout(tick, 1000 - (current % 1000));
		};

		tick();
		return () => clearTimeout(timer);
	});

	const remaining = $derived(now === null ? null : endsAt - now);
</script>

<!-- role="timer" has an implicit aria-live of "off", so screen readers aren't spammed every second. -->
<!-- Inline so it beats any type-* utility passed in: ticking digits must not jitter. -->
<span
	role="timer"
	class={className}
	class:text-live={live}
	style="font-variant-numeric: tabular-nums"
>
	{#if remaining === null}
		--
	{:else if remaining <= 0}
		{t('auction.closed')}
	{:else}
		{template ? template(formatCountdown(remaining)) : formatCountdown(remaining)}
	{/if}
</span>
