<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'link';

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
		'inline-flex items-center justify-center gap-2 font-sans font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

	const variants: Record<Variant, string> = {
		primary:
			'min-h-12 rounded-control bg-paper px-6 text-wall hover:bg-aluminium disabled:hover:bg-paper',
		secondary:
			'min-h-12 rounded-control border border-paper px-6 text-paper hover:bg-paper/10 disabled:hover:bg-transparent',
		link: 'min-h-11 text-paper underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] hover:decoration-2'
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
