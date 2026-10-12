<!-- Errors during client-side navigation, e.g. a link to a work that no longer exists. -->
<script lang="ts">
	import { page } from '$app/state';
	import NotFound from '#lib/components/NotFound.svelte';
</script>

<NotFound pathname={page.url.pathname} status={page.status} />
