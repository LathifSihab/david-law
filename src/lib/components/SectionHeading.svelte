<script lang="ts">
	interface Props {
		id: string;
		title: string;
		/** Optional line under the title. */
		subtitle?: string;
		/** Optional link on the right, e.g. "Alle veilingen". */
		href?: string;
		linkLabel?: string;
	}

	let { id, title, subtitle, href, linkLabel }: Props = $props();
</script>

<div class="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 md:mb-8">
	<div>
		<h2 {id} class="type-h2">{title}</h2>
		{#if subtitle}
			<p class="mt-1 text-muted">{subtitle}</p>
		{/if}
	</div>
	{#if href && linkLabel}
		<!-- Callers pass a resolved URL; resolve() belongs at the call site (as in Button). -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			{href}
			class="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand hover:text-brand-strong hover:underline hover:underline-offset-4"
		>
			{linkLabel}
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				aria-hidden="true"
			>
				<path d="M6 3.5L10.5 8 6 12.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
</div>
