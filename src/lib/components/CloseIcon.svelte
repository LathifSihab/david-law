<script lang="ts">
	let { size = 16 }: { size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	aria-hidden="true"
	focusable="false"
>
	<path d="M3 3l10 10M13 3L3 13" />
</svg>
