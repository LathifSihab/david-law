<!-- Collectie hero: "the archive wall". A light paper panel with three columns of matted and
     framed works drifting past, up, down, up, at different speeds, so the whole collection is
     felt at once. Technique pills lead straight into the filters. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '#lib/i18n/index.js';
	import type { Artwork } from '#lib/types.js';
	import { getMainImage } from '#lib/data/artworks.js';
	import DemoBadge from '../DemoBadge.svelte';
	import HeroHeading from './HeroHeading.svelte';

	interface Props {
		works: Artwork[];
		artistCount: number;
		techniques: { key: string; label: string; param: string; count: number }[];
	}

	let { works, artistCount, techniques }: Props = $props();

	const id = $props.id();

	// Deal the works into three columns; each column runs twice for a seamless loop.
	const COLUMNS = [
		{ duration: 70, reverse: false },
		{ duration: 88, reverse: true },
		{ duration: 78, reverse: false }
	];
	const columns = $derived(
		COLUMNS.map((column, c) => ({
			...column,
			works: works.filter((_, i) => i % COLUMNS.length === c)
		}))
	);

	// Three ways of hanging a print, so the wall reads as a real archive, not a grid.
	const MOUNTS = ['mat', 'frame', 'bare'] as const;
</script>

<section class="shell pt-5 md:pt-8" aria-labelledby="{id}-title">
	<div
		class="paper relative isolate grid overflow-hidden rounded-card bg-paper text-ink lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
	>
		<div class="flex flex-col justify-center p-6 sm:p-10 lg:py-14 lg:pr-4 lg:pl-12">
			<HeroHeading
				id="{id}-title"
				eyebrow={t('catalogue.title')}
				title={t('catalogue.heroTitle')}
				accent={t('catalogue.heroAccent')}
				intro={t('catalogue.heroIntro')}
				muted="text-muted"
				accentClass="text-live"
			>
				<p class="type-small text-muted">
					{t('catalogue.heroSummary', { works: works.length, artists: artistCount })}
				</p>
				<h2 class="sr-only">{t('catalogue.heroBrowse')}</h2>
				<ul class="mt-3 flex flex-wrap gap-2">
					{#each techniques as technique (technique.key)}
						<li>
							<a
								href={resolve(`/collectie?techniek=${technique.param}`)}
								class="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/20 bg-canvas/60 px-4 font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-canvas"
							>
								{technique.label}
								<span class="type-small font-normal opacity-70">{technique.count}</span>
							</a>
						</li>
					{/each}
				</ul>
			</HeroHeading>
		</div>

		<!-- The wall: decorative, every work is in the grid below. -->
		<div class="wall relative h-[24rem] sm:h-[30rem] lg:h-auto lg:min-h-[36rem]" aria-hidden="true">
			<div class="absolute inset-0 grid grid-cols-3 gap-3 px-4 sm:gap-5 sm:px-8 lg:pr-10 lg:pl-2">
				{#each columns as column, c (c)}
					<div class="min-h-0 overflow-visible">
						<div
							class="column flex flex-col"
							class:reverse={column.reverse}
							style="--duration: {column.duration}s"
						>
							{#each [0, 1] as copy (copy)}
								{#each column.works as work, i (work.id)}
									{@const image = getMainImage(work)}
									{@const mount = MOUNTS[(i + c) % MOUNTS.length]}
									<a
										href={resolve('/collectie/[slug]', { slug: work.slug })}
										tabindex="-1"
										class="tile relative mb-3 block sm:mb-5 {mount}"
										data-copy={copy}
									>
										<img
											src={image.thumb}
											width={image.width}
											height={image.height}
											alt={image.alt}
											loading={copy === 0 && i < 3 ? 'eager' : 'lazy'}
											decoding="async"
											class="block h-auto w-full"
											style="aspect-ratio: {image.width} / {image.height}"
										/>
										{#if work.isDemo}
											<DemoBadge class="absolute top-1.5 left-1.5 origin-top-left scale-75" />
										{/if}
									</a>
								{/each}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Warm paper with a soft daylight wash from the top right. */
	.paper {
		background:
			radial-gradient(70% 70% at 85% 0%, rgb(255 255 255 / 0.85), transparent 60%),
			radial-gradient(60% 60% at 0% 100%, rgb(194 65 12 / 0.06), transparent 70%),
			var(--color-paper);
	}

	/* Works fade in and out at the top and bottom edge of the wall. */
	.wall {
		mask-image: linear-gradient(to bottom, transparent, black 14%, black 86%, transparent);
	}

	.column {
		animation: drift var(--duration) linear infinite;
	}

	.column.reverse {
		animation-direction: reverse;
	}

	.wall:hover .column {
		animation-play-state: paused;
	}

	@keyframes drift {
		to {
			translate: 0 -50%;
		}
	}

	.tile {
		transition:
			translate 400ms var(--ease-gallery),
			box-shadow 400ms var(--ease-gallery);
	}

	.tile:hover {
		translate: 0 -4px;
	}

	/* Passe-partout: a white mat around the print. */
	.mat {
		background: #fff;
		padding: 9%;
		box-shadow:
			0 1px 2px rgb(16 18 24 / 0.08),
			0 14px 30px -14px rgb(16 18 24 / 0.35);
	}

	/* A thin black gallery frame. */
	.frame {
		border: 5px solid #1b1c20;
		box-shadow: 0 18px 36px -16px rgb(16 18 24 / 0.5);
	}

	/* Unframed, straight on the wall. */
	.bare {
		box-shadow: 0 10px 24px -12px rgb(16 18 24 / 0.4);
	}
</style>
