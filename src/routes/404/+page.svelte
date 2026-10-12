<!--
	Prerendered as build/404.html: the page a static host serves for any unknown URL.
	It is generated at /404, so the real path is only known in the browser.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import NotFound from '#lib/components/NotFound.svelte';

	let pathname = $state('');
	onMount(() => (pathname = window.location.pathname));
</script>

<NotFound {pathname} />
