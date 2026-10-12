<!-- Kunstenaars hero: "the hall of names". Every artist's name in serif, as on a museum wall;
     pointing at (or focusing) a name brings their work into the arched niche, with their
     monogram behind it. When nobody interacts it walks through the names by itself. -->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import { t, plural } from '#lib/i18n/index.js';
	import type { Artist, ArtworkImage } from '#lib/types.js';
	import DemoBadge from '../DemoBadge.svelte';
	import HeroHeading from './HeroHeading.svelte';

	interface Props {
		entries: { artist: Artist; count: number; image?: ArtworkImage; isDemoWork: boolean }[];
	}

	let { entries }: Props = $props();

	const ROTATE_MS = 4500;
	const id = $props.id();

	// A real (non-demo) artist opens the hall when there is one.
	// The list is static per page, so reading the initial value is intended.
	let active = $state(
		untrack(() =>
			Math.max(
				0,
				entries.findIndex((e) => !e.artist.isDemo)
			)
		)
	);
	let paused = $state(false);
	let reduced = $state(true);
	onMount(() => (reduced = matchMedia('(prefers-reduced-motion: reduce)').matches));

	const current = $derived(entries[active]);

	$effect(() => {
		if (reduced || paused || entries.length < 2) return;
		const next = (active + 1) % entries.length;
		const timer = setTimeout(() => (active = next), ROTATE_MS);
		return () => clearTimeout(timer);
	});

	const initials = (name: string) =>
		name
			.split(/[\s-]+/)
			.filter((part) => /^\p{Lu}/u.test(part))
			.map((part) => part[0])
			.slice(0, 2)
			.join('');

	const zoomIn = (node: Element, { duration }: { duration: number }) => ({
		duration,
		easing: cubicOut,
		css: (t: number) => `opacity: ${t}; scale: ${1.08 - 0.08 * t}`
	});
</script>

<section class="shell pt-5 md:pt-8" aria-labelledby="{id}-title">
	<div
		class="moss relative isolate grid overflow-hidden rounded-card bg-moss text-bone lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
	>
		<div class="flex flex-col justify-center p-6 sm:p-10 lg:py-14 lg:pr-6 lg:pl-12">
			<HeroHeading
				id="{id}-title"
				eyebrow={t('artist.indexTitle')}
				title={t('artist.heroTitle')}
				accent={t('artist.heroAccent')}
				intro={t('artist.heroIntro')}
				muted="text-moss-muted"
				accentClass="text-[#d8c39a]"
			>
				<nav aria-label={t('artist.heroIndex')}>
					<ul
						class="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-bone/15 pt-6 font-display text-xl leading-snug sm:text-2xl"
						onpointerenter={() => (paused = true)}
						onpointerleave={() => (paused = false)}
						onfocusin={() => (paused = true)}
						onfocusout={() => (paused = false)}
					>
						{#each entries as { artist }, i (artist.slug)}
							<li class="flex items-baseline gap-2">
								<a
									href={resolve('/kunstenaars/[slug]', { slug: artist.slug })}
									class="name rounded-sm transition-colors duration-500 {i === active
										? 'text-bone italic'
										: 'text-moss-muted/70 hover:text-bone'}"
									aria-current={i === active ? 'true' : undefined}
									onpointerenter={() => (active = i)}
									onfocus={() => (active = i)}
								>
									{artist.name}
								</a>
								{#if i < entries.length - 1}
									<span class="text-moss-muted/40" aria-hidden="true">/</span>
								{/if}
							</li>
						{/each}
					</ul>
				</nav>
			</HeroHeading>
		</div>

		<!-- The niche: decorative echo of the hovered name. -->
		<div
			class="relative flex h-[32rem] flex-col items-center justify-center gap-10 sm:h-[36rem] lg:h-auto lg:min-h-[38rem]"
			aria-hidden="true"
		>
			{#if current}
				<!-- Monogram -->
				<div class="pointer-events-none absolute inset-0 grid place-items-center">
					{#key current.artist.slug}
						<span
							class="monogram col-start-1 row-start-1 font-display leading-none font-medium italic"
							transition:fade={{ duration: reduced ? 0 : 700 }}
						>
							{initials(current.artist.name)}
						</span>
					{/key}
				</div>

				<div class="enter-hang relative">
					<!-- Outer arch line, like the moulding of a niche -->
					<div class="niche-line pointer-events-none absolute -inset-3 rounded-t-full"></div>
					<div
						class="niche relative grid h-[19rem] w-[14.25rem] overflow-hidden rounded-t-full sm:h-[23rem] sm:w-[17.25rem] lg:h-[26rem] lg:w-[19.5rem]"
					>
						{#each entries as entry, i (entry.artist.slug)}
							{#if i === active && entry.image}
								<img
									src={entry.image.thumb}
									width={entry.image.width}
									height={entry.image.height}
									alt={entry.image.alt}
									decoding="async"
									class="kenburns col-start-1 row-start-1 size-full object-cover"
									transition:zoomIn={{ duration: reduced ? 0 : 900 }}
								/>
							{/if}
						{/each}
					</div>
					{#if current.isDemoWork}
						<DemoBadge class="absolute bottom-3 left-1/2 -translate-x-1/2" />
					{/if}
				</div>

				<!-- Label -->
				<div class="relative grid text-center">
					{#key current.artist.slug}
						<div class="col-start-1 row-start-1" in:fade={{ duration: reduced ? 0 : 600 }}>
							<p class="font-display text-2xl">{current.artist.name}</p>
							<p class="mt-1 text-xs tracking-[0.18em] text-moss-muted uppercase">
								{#if current.artist.basedIn}
									{current.artist.basedIn} ·
								{/if}
								{plural(current.count, 'home.worksCountOne', 'home.worksCount')}
							</p>
						</div>
					{/key}
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.moss {
		background:
			radial-gradient(60% 70% at 72% 40%, rgb(236 226 207 / 0.1), transparent 70%),
			radial-gradient(50% 50% at 0% 0%, rgb(120 160 130 / 0.1), transparent 70%), var(--color-moss);
	}

	.monogram {
		font-size: clamp(12rem, 26vw, 22rem);
		color: rgb(236 226 207 / 0.05);
	}

	.niche {
		background: rgb(0 0 0 / 0.25);
		box-shadow:
			inset 0 0 0 1px rgb(236 226 207 / 0.15),
			0 40px 80px -30px rgb(0 0 0 / 0.8);
	}

	.niche-line {
		border: 1px solid rgb(236 226 207 / 0.22);
		border-bottom: 0;
	}

	/* The work slowly breathes closer while it is on view. */
	.kenburns {
		animation: kenburns 9s ease-out both;
	}

	@keyframes kenburns {
		to {
			transform: scale(1.06);
		}
	}

	.name {
		text-decoration: none;
	}
</style>
