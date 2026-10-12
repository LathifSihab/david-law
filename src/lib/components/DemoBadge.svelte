<script lang="ts">
	import { t } from '#lib/i18n/index.js';

	interface Props {
		/** 'work' → "Demo-werk" (over an image), 'artist' → "Demo-kunstenaar" (next to a name). */
		kind?: 'work' | 'artist';
		class?: string;
	}

	let { kind = 'work', class: className = '' }: Props = $props();
</script>

<span
	class="inline-flex items-center rounded-full bg-demo px-2.5 py-0.5 text-xs leading-tight font-semibold whitespace-nowrap text-canvas {className}"
>
	{kind === 'work' ? t('demo.badge') : t('demo.artistBadge')}
</span>
