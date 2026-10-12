<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { config } from '#lib/config.js';
	import { t } from '#lib/i18n/index.js';
	import CloseIcon from './CloseIcon.svelte';

	const links = [
		{ href: resolve('/collectie'), label: t('nav.collection') },
		{ href: resolve('/kunstenaars'), label: t('nav.artists') },
		{ href: resolve('/veilingen'), label: t('nav.auctions') }
	];

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	let scrollY = $state(0);
	const scrolled = $derived(scrollY > 8);

	// Inline search
	let searchOpen = $state(false);
	let query = $state('');
	let searchInput = $state<HTMLInputElement>();
	let searchButton = $state<HTMLButtonElement>();

	async function toggleSearch() {
		searchOpen = !searchOpen;
		if (searchOpen) {
			await tick();
			searchInput?.focus();
		}
	}

	function closeSearch() {
		searchOpen = false;
		searchButton?.focus();
	}

	async function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const q = query.trim();
		searchOpen = false;
		query = '';
		await goto(q ? resolve(`/collectie?q=${encodeURIComponent(q)}`) : resolve('/collectie'));
	}

	// Mobile menu sheet: a native modal <dialog> traps focus and closes on Esc.
	let menu = $state<HTMLDialogElement>();
	const openMenu = () => menu?.showModal();
	const closeMenu = () => menu?.close();
</script>

<svelte:window bind:scrollY />

<header
	class="sticky top-0 z-40 border-b transition-colors duration-200 {scrolled
		? 'border-hairline bg-wall/85 backdrop-blur-md'
		: 'border-transparent bg-wall'}"
>
	<div class="shell flex h-16 items-center justify-between gap-6 md:h-20">
		<a
			href={resolve('/')}
			class="-my-2 inline-flex min-h-11 items-center py-2 font-display text-[1.75rem] leading-none md:text-[2rem]"
		>
			{config.brandName}
		</a>

		<div class="flex items-center gap-2 md:gap-8">
			<nav aria-label={t('nav.menu')} class="hidden md:block">
				<ul class="flex items-center gap-8">
					{#each links as link (link.href)}
						<li>
							<a
								href={link.href}
								aria-current={isCurrent(link.href) ? 'page' : undefined}
								class="inline-flex min-h-11 items-center text-aluminium underline-offset-[6px] transition-colors hover:text-paper aria-[current=page]:text-paper aria-[current=page]:underline"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<button
				bind:this={searchButton}
				type="button"
				class="grid size-11 place-items-center rounded-control text-aluminium hover:text-paper"
				aria-label={t('nav.search')}
				aria-expanded={searchOpen}
				aria-controls="site-search"
				onclick={toggleSearch}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					aria-hidden="true"
				>
					<circle cx="8.5" cy="8.5" r="5.75" />
					<path d="M13 13l4.5 4.5" stroke-linecap="round" />
				</svg>
			</button>

			<button
				type="button"
				class="-mr-2 grid size-11 place-items-center rounded-control text-paper md:hidden"
				aria-label={t('nav.menu')}
				aria-haspopup="dialog"
				onclick={openMenu}
			>
				<svg
					width="22"
					height="22"
					viewBox="0 0 22 22"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M3 7h16M3 15h16" />
				</svg>
			</button>
		</div>
	</div>

	{#if searchOpen}
		<div id="site-search" class="border-t border-hairline">
			<form role="search" class="shell flex gap-3 py-4" onsubmit={submitSearch}>
				<label for="site-search-input" class="sr-only">{t('nav.search')}</label>
				<input
					bind:this={searchInput}
					onkeydown={(e) => e.key === 'Escape' && closeSearch()}
					bind:value={query}
					id="site-search-input"
					type="search"
					name="q"
					autocomplete="off"
					placeholder={t('nav.searchPlaceholder')}
					class="h-12 min-w-0 flex-1 rounded-control border border-hairline bg-plinth px-4 text-paper placeholder:text-aluminium"
				/>
				<button
					type="submit"
					class="h-12 shrink-0 rounded-control bg-paper px-5 font-medium text-wall hover:bg-aluminium"
				>
					{t('nav.search')}
				</button>
			</form>
		</div>
	{/if}
</header>

<dialog
	bind:this={menu}
	aria-label={t('nav.menu')}
	class="m-0 h-dvh max-h-none w-full max-w-none bg-wall p-0 text-paper backdrop:bg-transparent md:hidden"
>
	<div class="shell flex h-16 items-center justify-between">
		<span class="font-display text-[1.75rem] leading-none" aria-hidden="true"
			>{config.brandName}</span
		>
		<button
			type="button"
			class="-mr-2 grid size-11 place-items-center rounded-control"
			aria-label={t('nav.close')}
			onclick={closeMenu}
		>
			<CloseIcon size={20} />
		</button>
	</div>
	<nav aria-label={t('nav.menu')} class="shell pt-10">
		<ul class="space-y-2">
			<li>
				<a href={resolve('/')} onclick={closeMenu} class="block py-2 type-h1">{config.brandName}</a>
			</li>
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={isCurrent(link.href) ? 'page' : undefined}
						onclick={closeMenu}
						class="block py-2 type-h1 aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-8"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
		<a
			href="mailto:{config.contactEmail}"
			class="mt-10 inline-block py-2 text-aluminium underline underline-offset-4"
		>
			{t('nav.contact')}
		</a>
	</nav>
</dialog>
