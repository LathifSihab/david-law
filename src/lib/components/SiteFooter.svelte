<script lang="ts">
	import { resolve } from '$app/paths';
	import { config } from '#lib/config.js';
	import { t } from '#lib/i18n/index.js';
	import { TECHNIQUE_GROUPS } from '#lib/utils/catalogue.js';

	const discover = [
		{ href: resolve('/veilingen'), label: t('nav.auctions') },
		{ href: resolve('/collectie'), label: t('nav.collection') },
		{ href: resolve('/kunstenaars'), label: t('nav.artists') },
		{ href: resolve('/favorieten'), label: t('favourites.title') }
	];

	const categories = TECHNIQUE_GROUPS.map((group) => ({
		href: resolve(`/collectie?techniek=${group.param}`),
		label: t(`catalogue.technique.${group.key}`)
	}));

	const linkClass =
		'inline-flex min-h-10 items-center text-night-muted hover:text-canvas hover:underline hover:underline-offset-4';
</script>

<footer class="bg-night text-canvas">
	<div class="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:py-16">
		<div class="space-y-4">
			<a
				href={resolve('/')}
				class="inline-flex min-h-11 items-center font-display text-[2rem] leading-none font-semibold"
				>{config.brandName}</a
			>
			<p class="max-w-[40ch] type-small text-night-muted">{t('brand.footerLine')}</p>
		</div>

		<nav aria-labelledby="footer-discover">
			<h2 id="footer-discover" class="mb-3 font-semibold">{t('footer.discover')}</h2>
			<ul>
				{#each discover as link (link.href)}
					<li><a href={link.href} class={linkClass}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<nav aria-labelledby="footer-categories">
			<h2 id="footer-categories" class="mb-3 font-semibold">{t('footer.categories')}</h2>
			<ul>
				{#each categories as link (link.href)}
					<li><a href={link.href} class={linkClass}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div>
			<h2 class="mb-3 font-semibold">{t('footer.help')}</h2>
			<ul>
				<li>
					<a href="{resolve('/veilingen')}#how-title" class={linkClass}>{t('footer.howBidding')}</a>
				</li>
				<li>
					<a href="mailto:{config.contactEmail}" class={linkClass}>{t('nav.contact')}</a>
				</li>
				<li>
					<!-- The import mock is reachable only from here (docs/04 section 7). -->
					<a href={resolve('/admin/import')} class={linkClass}>{t('nav.admin')}</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="border-t border-canvas/10">
		<div
			class="shell flex flex-col gap-2 py-6 type-small text-night-muted sm:flex-row sm:justify-between"
		>
			<p>{t('footer.rights')}</p>
			<p>{t('demo.banner')}</p>
		</div>
	</div>
</footer>
