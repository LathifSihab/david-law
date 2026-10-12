<!--
	Marketplace header: wordmark, a search field that is always visible, account and favourites,
	and a strip of categories underneath (horizontally scrollable on phones).
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { config } from '#lib/config.js';
	import { t } from '#lib/i18n/index.js';
	import { LIMITS, sanitizeText } from '#lib/utils/input.js';
	import { TECHNIQUE_GROUPS } from '#lib/utils/catalogue.js';
	import { favourites } from '#lib/data/favourites.svelte.js';
	import CloseIcon from './CloseIcon.svelte';
	import { toast } from './toasts.svelte.js';

	const links = [
		{ href: resolve('/veilingen'), label: t('nav.auctions') },
		{ href: resolve('/collectie'), label: t('nav.collection') },
		{ href: resolve('/kunstenaars'), label: t('nav.artists') }
	];

	const categories = TECHNIQUE_GROUPS.map((group) => ({
		href: resolve(`/collectie?techniek=${group.param}`),
		label: t(`catalogue.technique.${group.key}`)
	}));

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	let scrollY = $state(0);
	const scrolled = $derived(scrollY > 8);

	let query = $state('');

	async function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const q = sanitizeText(query, LIMITS.search);
		query = '';
		(document.activeElement as HTMLElement | null)?.blur();
		await goto(q ? resolve(`/collectie?q=${encodeURIComponent(q)}`) : resolve('/collectie'));
	}

	// Mobile menu sheet: a native modal <dialog> traps focus and closes on Esc.
	let menu = $state<HTMLDialogElement>();
	const openMenu = () => menu?.showModal();
	const closeMenu = () => menu?.close();
</script>

<svelte:window bind:scrollY />

{#snippet searchForm(id: string, className: string)}
	<form role="search" class={className} onsubmit={submitSearch}>
		<div class="relative">
			<label for={id} class="sr-only">{t('nav.search')}</label>
			<svg
				class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
				width="18"
				height="18"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				aria-hidden="true"
			>
				<circle cx="8.5" cy="8.5" r="5.75" />
				<path d="M13 13l4.5 4.5" stroke-linecap="round" />
			</svg>
			<input
				bind:value={query}
				{id}
				type="search"
				name="q"
				maxlength={LIMITS.search}
				autocomplete="off"
				placeholder={t('nav.searchPlaceholder')}
				class="h-12 w-full rounded-full border border-line bg-surface pr-28 pl-11 text-ink transition-colors placeholder:text-muted hover:border-muted focus:border-brand focus:bg-canvas"
			/>
			<button
				type="submit"
				class="absolute top-1.5 right-1.5 h-9 rounded-full bg-brand px-4 text-sm font-semibold text-canvas hover:bg-brand-strong"
			>
				{t('nav.search')}
			</button>
		</div>
	</form>
{/snippet}

<header
	class="sticky top-0 z-40 border-b border-line bg-canvas transition-shadow duration-200"
	class:shadow-card={scrolled}
>
	<div class="shell flex h-16 items-center gap-4 md:h-[4.5rem] md:gap-8">
		<a
			href={resolve('/')}
			class="-my-2 inline-flex min-h-11 shrink-0 items-center py-2 font-display text-[1.6rem] leading-none font-semibold md:text-[1.85rem]"
		>
			{config.brandName}
		</a>

		{@render searchForm('site-search', 'hidden max-w-2xl flex-1 md:block')}

		<div class="ml-auto flex items-center gap-1 md:gap-2">
			<button
				type="button"
				class="hidden h-11 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface md:inline-flex"
				onclick={() => toast.show(t('demo.toastLogin'))}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<circle cx="12" cy="8.5" r="4" /><path
						d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"
						stroke-linecap="round"
					/>
				</svg>
				{t('nav.login')}
			</button>

			<a
				href={resolve('/favorieten')}
				class="relative grid size-11 place-items-center rounded-full hover:bg-surface"
				aria-label={t('favourites.headerLabel', { count: favourites.size })}
				aria-current={isCurrent(resolve('/favorieten')) ? 'page' : undefined}
			>
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<path
						d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
						stroke-linejoin="round"
					/>
				</svg>
				{#if favourites.size}
					<span
						class="absolute top-1 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.6875rem] font-bold text-canvas tabular-nums"
						aria-hidden="true"
					>
						{favourites.size}
					</span>
				{/if}
			</a>

			<button
				type="button"
				class="-mr-2 grid size-11 place-items-center rounded-full hover:bg-surface md:hidden"
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
					stroke-width="1.8"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M3 6h16M3 11h16M3 16h16" />
				</svg>
			</button>
		</div>
	</div>

	{@render searchForm('site-search-mobile', 'shell pb-3 md:hidden')}

	<nav aria-label={t('nav.categories')} class="border-t border-line">
		<ul class="shell no-scrollbar flex h-12 items-center gap-1 overflow-x-auto whitespace-nowrap">
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={isCurrent(link.href) ? 'page' : undefined}
						class="relative inline-flex h-12 items-center px-3 font-semibold text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent hover:text-brand aria-[current=page]:text-brand aria-[current=page]:after:bg-brand"
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li aria-hidden="true" class="mx-2 h-5 w-px shrink-0 bg-line"></li>
			{#each categories as category (category.href)}
				<li>
					<a
						href={category.href}
						class="inline-flex h-12 items-center px-3 text-muted hover:text-brand"
					>
						{category.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<dialog
	bind:this={menu}
	aria-label={t('nav.menu')}
	class="m-0 h-dvh max-h-none w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-transparent md:hidden"
>
	<div class="shell flex h-16 items-center justify-between border-b border-line">
		<span class="font-display text-[1.6rem] leading-none font-semibold" aria-hidden="true"
			>{config.brandName}</span
		>
		<button
			type="button"
			class="-mr-2 grid size-11 place-items-center rounded-full hover:bg-surface"
			aria-label={t('nav.close')}
			onclick={closeMenu}
		>
			<CloseIcon size={20} />
		</button>
	</div>
	<nav aria-label={t('nav.menu')} class="shell py-6">
		<ul class="divide-y divide-line">
			<li>
				<a href={resolve('/')} onclick={closeMenu} class="block py-4 type-h2">{t('nav.home')}</a>
			</li>
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						aria-current={isCurrent(link.href) ? 'page' : undefined}
						onclick={closeMenu}
						class="block py-4 type-h2 aria-[current=page]:text-brand"
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li>
				<a href={resolve('/favorieten')} onclick={closeMenu} class="block py-4 type-h2">
					{t('favourites.title')}
				</a>
			</li>
		</ul>
		<p class="mt-8 mb-2 type-small font-semibold text-muted">{t('nav.categories')}</p>
		<ul class="flex flex-wrap gap-2">
			{#each categories as category (category.href)}
				<li>
					<a
						href={category.href}
						onclick={closeMenu}
						class="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-ink"
					>
						{category.label}
					</a>
				</li>
			{/each}
		</ul>
		<div class="mt-8 flex flex-wrap gap-3">
			<button
				type="button"
				class="inline-flex min-h-12 items-center rounded-control bg-brand px-6 font-semibold text-canvas"
				onclick={() => toast.show(t('demo.toastLogin'))}
			>
				{t('nav.login')}
			</button>
			<a
				href="mailto:{config.contactEmail}"
				class="inline-flex min-h-12 items-center px-2 text-brand underline underline-offset-4"
			>
				{t('nav.contact')}
			</a>
		</div>
	</nav>
</dialog>
