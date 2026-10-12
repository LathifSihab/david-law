<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Fade the spotlight in over 900ms on mount: "the lights come on" (home hero only). */
		lightsOn?: boolean;
		class?: string;
		children: Snippet;
	}

	let { lightsOn = false, class: className = '', children }: Props = $props();
</script>

<div class="relative isolate overflow-hidden bg-wall-deep {className}">
	<div class="glow pointer-events-none absolute inset-0 -z-10" class:lights-on={lightsOn}></div>
	<div class="flex h-full items-center justify-center p-[clamp(1.5rem,6vw,4.5rem)]">
		{@render children()}
	</div>
</div>

<style>
	.glow {
		background: radial-gradient(ellipse at 50% 40%, rgb(243 217 164 / 0.1), transparent 60%);
	}

	.lights-on {
		animation: lights-on 900ms var(--ease-gallery) both;
	}
</style>
