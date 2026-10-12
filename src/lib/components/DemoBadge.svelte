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
	class="inline-flex items-center rounded-full border border-demo bg-wall-deep/85 px-2.5 py-0.5 type-small leading-tight whitespace-nowrap text-paper {className}"
>
	{kind === 'work' ? t('demo.badge') : t('demo.artistBadge')}
</span>
