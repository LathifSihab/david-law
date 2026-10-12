<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Fade the light in over 900ms on mount (home hero only). */
		lightsOn?: boolean;
		class?: string;
		children: Snippet;
	}

	let { lightsOn = false, class: className = '', children }: Props = $props();
</script>

<!-- A softly lit wall behind the artwork, in a rounded well. -->
<div class="relative isolate overflow-hidden rounded-card bg-well {className}">
	<div class="glow pointer-events-none absolute inset-0 -z-10" class:lights-on={lightsOn}></div>
	<div class="flex h-full items-center justify-center p-[clamp(1.25rem,5vw,3.5rem)]">
		{@render children()}
	</div>
</div>

<style>
	.glow {
		background: radial-gradient(ellipse at 50% 40%, rgb(255 255 255 / 0.95), transparent 65%);
	}

	.lights-on {
		animation: lights-on 900ms var(--ease-gallery) both;
	}
</style>
