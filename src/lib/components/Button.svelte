<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'link';

	type Props = {
		variant?: Variant;
		/** Renders an `<a>` when set, otherwise a `<button>`. */
		href?: string;
		class?: string;
		children: Snippet;
	} & Omit<HTMLButtonAttributes, 'class' | 'children'> &
		Omit<HTMLAnchorAttributes, 'class' | 'children' | 'href' | 'type'>;

	let {
		variant = 'primary',
		href,
		type = 'button',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

	const variants: Record<Variant, string> = {
		primary:
			'min-h-12 rounded-control bg-brand px-6 text-canvas hover:bg-brand-strong disabled:hover:bg-brand',
		secondary:
			'min-h-12 rounded-control border border-ink bg-canvas px-6 text-ink hover:bg-surface disabled:hover:bg-canvas',
		/** For dark backgrounds (hero banner, newsletter band). */
		ghost:
			'min-h-12 rounded-control border border-canvas/40 px-6 text-canvas hover:bg-canvas/10 disabled:hover:bg-transparent',
		link: 'min-h-11 text-brand underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] hover:decoration-2'
	};

	const classes = $derived(`${base} ${variants[variant]} ${className}`);
</script>

{#if href}
	<!-- Callers pass a final URL (internal route, mailto:, ...); resolve() belongs at the call site. -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} class={classes} {...rest}>{@render children()}</a>
{:else}
	<button {type} class={classes} {...rest}>{@render children()}</button>
{/if}
