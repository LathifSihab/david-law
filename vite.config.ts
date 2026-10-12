import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Fully static: no SPA fallback, every route is prerendered (see src/routes/+layout.ts).
			// No options on purpose: the defaults (build/, strict, no fallback) are what we want, and
			// passing any option disables adapter-static's Vercel zero-config output.
			adapter: adapter(),
			// Root-relative asset URLs, so 404.html works when served at any depth (e.g. a missing
			// /collectie/<slug>). Relative "./_app" paths would resolve to /collectie/_app/.
			paths: { relative: false },
			// Inline the stylesheet (~44 kB, ~8 kB gzipped) so it doesn't block the first paint (Lighthouse:
			// it delayed the hero image, our LCP element, by ~1.5 s).
			inlineStyleThreshold: 60_000
		})
	]
});
