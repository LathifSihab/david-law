<script lang="ts">
	import { resolve } from '$app/paths';
	import { config } from '#lib/config.js';
	import { t } from '#lib/i18n/index.js';
</script>

<footer class="bg-wall-deep">
	<div class="shell grid gap-10 py-16 md:grid-cols-[2fr_1fr_1fr]">
		<div class="space-y-3">
			<a href={resolve('/')} class="inline-block py-1 font-display text-[2rem] leading-none"
				>{config.brandName}</a
			>
			<p class="max-w-[42ch] type-small text-aluminium">{t('brand.footerLine')}</p>
		</div>

		<nav>
			<ul class="space-y-1">
				<li>
					<a
						href={resolve('/collectie')}
						class="inline-block py-1.5 hover:underline hover:underline-offset-4"
						>{t('nav.collection')}</a
					>
				</li>
				<li>
					<a
						href={resolve('/kunstenaars')}
						class="inline-block py-1.5 hover:underline hover:underline-offset-4"
						>{t('nav.artists')}</a
					>
				</li>
				<li>
					<a
						href={resolve('/veilingen')}
						class="inline-block py-1.5 hover:underline hover:underline-offset-4"
						>{t('nav.auctions')}</a
					>
				</li>
			</ul>
		</nav>

		<div class="space-y-1">
			<a
				href="mailto:{config.contactEmail}"
				class="inline-block py-1.5 hover:underline hover:underline-offset-4"
			>
				{t('nav.contact')}
			</a>
			<p class="type-small text-aluminium">{t('footer.rights')}</p>
		</div>
	</div>
</footer>
