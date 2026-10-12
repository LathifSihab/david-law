<script lang="ts">
	import { t } from '#lib/i18n/index.js';
	import CloseIcon from './CloseIcon.svelte';

	// Dismissed for this session only: component state, no storage (docs/02).
	let visible = $state(true);
</script>

{#if visible}
	<div class="bg-demo text-wall-deep">
		<div class="shell flex items-center justify-between gap-4">
			<p class="py-2 type-small font-medium">{t('demo.banner')}</p>
			<button
				type="button"
				class="-mr-3 grid size-11 shrink-0 place-items-center rounded-control hover:bg-wall-deep/10 focus-visible:-outline-offset-4 focus-visible:outline-wall-deep"
				aria-label={t('demo.bannerClose')}
				onclick={() => (visible = false)}
			>
				<CloseIcon />
			</button>
		</div>
	</div>
{/if}
