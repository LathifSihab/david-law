<script lang="ts">
	import { t } from '#lib/i18n/index.js';
	import { formatCountdown } from '#lib/utils/format.js';

	interface Props {
		/** End time as epoch milliseconds. */
		endsAt: number;
		/** Called once when the countdown reaches zero. */
		onend?: () => void;
		class?: string;
	}

	let { endsAt, onend, class: className = '' }: Props = $props();

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
<span role="timer" class="text-live tabular-nums {className}">
	{#if remaining === null}
		--
	{:else if remaining <= 0}
		{t('auction.closed')}
	{:else}
		{formatCountdown(remaining)}
	{/if}
</span>
