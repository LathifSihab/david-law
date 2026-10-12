<!-- Heart toggle on cards and detail pages. Session-only, with a demo toast. -->
<script lang="ts">
	import { t } from '#lib/i18n/index.js';
	import { favourites, toggleFavourite } from '#lib/data/favourites.svelte.js';
	import { toast } from './toasts.svelte.js';

	interface Props {
		id: string;
		title: string;
		class?: string;
	}

	let { id, title, class: className = '' }: Props = $props();

	const saved = $derived(favourites.has(id));

	function onclick() {
		toast.show(toggleFavourite(id) ? t('favourites.added') : t('favourites.removed'));
	}
</script>

<button
	type="button"
	class="grid size-10 place-items-center rounded-full bg-canvas text-ink shadow-card transition-[color,transform] duration-150 hover:scale-105 hover:text-brand {className}"
	class:text-brand={saved}
	aria-pressed={saved}
	aria-label={saved ? t('favourites.remove', { title }) : t('favourites.add', { title })}
	{onclick}
>
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="1.8"
		aria-hidden="true"
	>
		<path
			d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
			fill={saved ? 'currentColor' : 'none'}
			stroke-linejoin="round"
		/>
	</svg>
</button>
