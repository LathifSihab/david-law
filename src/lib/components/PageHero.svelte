<!-- Index-page hero (collectie, veilingen, kunstenaars): an editorial headline beside a small
     salon hang of works under a gallery spotlight. Works drop onto the wall, float gently and
     shift with the pointer for depth. All motion stops under prefers-reduced-motion. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ArtworkImage } from '#lib/types.js';
	import DemoBadge from './DemoBadge.svelte';

	export interface HeroWork {
		image: ArtworkImage;
		isDemo: boolean;
		/** Small museum label under the frame, e.g. the artist's name. */
		caption?: string;
	}

	interface Props {
		eyebrow: string;
		title: string;
		/** Last words of the headline, set in italic. */
		accent?: string;
		intro: string;
		works: HeroWork[];
		stats?: { value: string | number; label: string }[];
		/** 'arch' gives every frame a rounded top, like a gallery niche. */
		shape?: 'rect' | 'arch';
		/** Live dot before the eyebrow (auctions). */
		live?: boolean;
		/** Extra content under the stats, e.g. a countdown. */
		children?: Snippet;
	}

	let {
		eyebrow,
		title,
		accent,
		intro,
		works,
		stats = [],
		shape = 'rect',
		live = false,
		children
	}: Props = $props();

	// Salon hang: centre point, maximum height and width as a share of the wall; depth drives the
	// parallax.
	// Slots 3 and 4 only show from `sm` up, so a phone gets a calm three-work wall.
	const SLOTS = [
		{ x: 50, y: 47, h: 60, w: 40, depth: 1 },
		{ x: 16, y: 33, h: 32, w: 24, depth: 0.55 },
		{ x: 84, y: 29, h: 30, w: 22, depth: 0.7 },
		{ x: 19, y: 77, h: 27, w: 22, depth: 0.4 },
		{ x: 82, y: 75, h: 31, w: 24, depth: 0.6 }
	];

	// A real work (not a placeholder) takes the big centre spot when there is one.
	const hung = $derived(
		[...works]
			.sort((a, b) => Number(a.isDemo) - Number(b.isDemo))
			.slice(0, SLOTS.length)
			.map((work, i) => {
				const slot = SLOTS[i];
				// Height/width of the frame: arches are cut to 3:4, other works keep their own shape.
				const ratio = shape === 'arch' ? 4 / 3 : work.image.height / work.image.width;
				// Tallest the work can hang without breaking out of its slot sideways.
				const height = `min(${slot.h}cqh, ${(slot.w * ratio).toFixed(2)}cqw)`;
				const width = `calc(${height} / ${ratio.toFixed(4)})`;
				return { work, slot, height, width };
			})
	);

	const id = $props.id();

	let hero = $state<HTMLElement>();

	function onPointerMove(event: PointerEvent) {
		if (!hero || event.pointerType !== 'mouse') return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const box = hero.getBoundingClientRect();
		hero.style.setProperty('--px', ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
		hero.style.setProperty('--py', ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
	}

	function onPointerLeave() {
		hero?.style.setProperty('--px', '0');
		hero?.style.setProperty('--py', '0');
	}
</script>

<section class="shell pt-5 md:pt-8" aria-labelledby="{id}-title">
	<div
		bind:this={hero}
		role="presentation"
		class="hero relative isolate grid overflow-hidden rounded-card bg-night text-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
		onpointermove={onPointerMove}
		onpointerleave={onPointerLeave}
	>
		<div class="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true"></div>

		<!-- Text -->
		<div class="relative flex flex-col justify-center p-6 sm:p-10 lg:py-14 lg:pr-4 lg:pl-12">
			<p
				class="enter flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-night-muted uppercase"
			>
				{#if live}
					<span class="relative flex size-2" aria-hidden="true">
						<span
							class="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-75"
						></span>
						<span class="relative inline-flex size-2 rounded-full bg-live"></span>
					</span>
				{:else}
					<span class="h-px w-8 bg-current" aria-hidden="true"></span>
				{/if}
				{eyebrow}
			</p>

			<h1
				id="{id}-title"
				class="enter mt-5 max-w-[14ch] type-hero text-balance"
				style="--enter-delay: 90ms"
			>
				{title}
				{#if accent}<em class="text-[#e9d9bf]">{accent}</em>{/if}
			</h1>

			<p class="enter mt-5 max-w-[44ch] text-night-muted" style="--enter-delay: 180ms">{intro}</p>

			{#if stats.length}
				<dl
					class="enter mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-canvas/15 pt-6"
					style="--enter-delay: 270ms"
				>
					{#each stats as stat (stat.label)}
						<div class="flex flex-col-reverse">
							<dt class="type-small text-night-muted">{stat.label}</dt>
							<dd class="font-display text-4xl leading-none font-medium tabular-nums">
								{stat.value}
							</dd>
						</div>
					{/each}
				</dl>
			{/if}

			{#if children}
				<div class="enter mt-6" style="--enter-delay: 360ms">{@render children()}</div>
			{/if}
		</div>

		<!-- Wall: the cell takes its size from the grid; the inner layer is the size container
		     (cq units would read 0 if the container's height came from min-height alone). -->
		<div class="relative h-80 sm:h-[26rem] lg:h-auto lg:min-h-[32rem]">
			<div class="wall absolute inset-0">
				<div class="spot pointer-events-none absolute inset-0" aria-hidden="true"></div>
				{#each hung as { work, slot, height, width }, i (work.image.src)}
					<div
						class="frame enter-hang absolute {i >= 3 ? 'hidden sm:block' : ''}"
						style="left: {slot.x}%; top: {slot.y}%; height: {height}; width: {width}; z-index: {Math.round(
							slot.depth * 10
						)}; --depth: {slot.depth}; --enter-delay: {200 + i * 120}ms; --float-delay: {-i * 1.7}s"
					>
						<div class="parallax h-full">
							<figure class="float relative m-0 h-full">
								<img
									src={work.image.thumb}
									width={work.image.width}
									height={work.image.height}
									alt={work.image.alt}
									loading="eager"
									decoding="async"
									fetchpriority={i === 0 ? 'high' : 'auto'}
									class="art block size-full object-cover {shape === 'arch'
										? 'rounded-t-full'
										: ''}"
								/>
								{#if work.isDemo}
									<DemoBadge class="absolute top-2 left-2 origin-top-left scale-90" />
								{/if}
								{#if work.caption}
									<figcaption
										class="absolute top-full left-1/2 mt-2 -translate-x-1/2 text-center text-[0.6875rem] tracking-[0.14em] whitespace-nowrap text-night-muted uppercase"
									>
										{work.caption}
									</figcaption>
								{/if}
							</figure>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Deep gallery night with a warm haze where the works hang. */
	.hero {
		--px: 0;
		--py: 0;
		background:
			radial-gradient(90% 70% at 78% 10%, rgb(233 217 191 / 0.1), transparent 60%),
			radial-gradient(60% 60% at 0% 100%, rgb(35 64 230 / 0.12), transparent 70%),
			var(--color-night);
	}

	/* Film grain so the dark doesn't read as flat plastic. */
	.grain {
		opacity: 0.07;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}

	/* A ceiling spot over the centre work that slowly breathes. */
	.spot {
		background: radial-gradient(
			ellipse 46% 62% at 50% 38%,
			rgb(255 244 226 / 0.16),
			rgb(255 244 226 / 0.04) 55%,
			transparent 75%
		);
		animation:
			lights-on 1400ms var(--ease-gallery) both,
			breathe 9s ease-in-out 1400ms infinite;
	}

	@keyframes breathe {
		50% {
			opacity: 0.7;
		}
	}

	.wall {
		container-type: size;
	}

	.frame {
		transform: translate(-50%, -50%);
	}

	.parallax {
		translate: calc(var(--px) * var(--depth) * -26px) calc(var(--py) * var(--depth) * -18px);
		transition: translate 900ms var(--ease-gallery);
	}

	.float {
		animation: float 9s ease-in-out var(--float-delay, 0s) infinite;
	}

	@keyframes float {
		50% {
			transform: translateY(-7px);
		}
	}

	/* Hung, not pasted: a hairline edge and a long soft drop shadow on the wall. */
	.art {
		box-shadow:
			0 0 0 1px rgb(255 255 255 / 0.08),
			0 2px 6px rgb(0 0 0 / 0.35),
			0 28px 50px -18px rgb(0 0 0 / 0.75);
		transition:
			scale 500ms var(--ease-gallery),
			box-shadow 500ms var(--ease-gallery);
	}

	.frame:hover .art {
		scale: 1.03;
		box-shadow:
			0 0 0 1px rgb(255 255 255 / 0.14),
			0 4px 10px rgb(0 0 0 / 0.35),
			0 40px 70px -20px rgb(0 0 0 / 0.85);
	}
</style>
