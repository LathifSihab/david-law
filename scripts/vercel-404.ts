/**
 * Post-build step for Vercel: serve our prerendered 404 page for unknown URLs.
 *
 * adapter-static's zero-config output (.vercel/output) has no error route, so Vercel answers
 * unknown paths with its own plain-text 404. This appends the Build Output API "error" phase,
 * pointing at /404 (src/routes/404). Locally there is no .vercel/output, so it does nothing.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const CONFIG = '.vercel/output/config.json';
const PAGE = '.vercel/output/static/404.html';

if (!existsSync(CONFIG)) process.exit(0);
if (!existsSync(PAGE)) {
	console.error(`vercel-404: ${PAGE} is missing, so the custom 404 page can't be served.`);
	process.exit(1);
}

interface Route {
	handle?: string;
	[key: string]: unknown;
}

const config = JSON.parse(readFileSync(CONFIG, 'utf8')) as {
	routes?: Route[];
	overrides?: Record<string, unknown>;
};
const routes = config.routes ?? [];

// The adapter serves 404.html at the clean path /404 via an override. Error-phase destinations
// resolve against real file paths, so keep the file at /404.html and point the error route there.
if (config.overrides) delete config.overrides['404.html'];

if (!routes.some((route) => route.handle === 'error')) {
	routes.push({ handle: 'error' }, { src: '/.*', dest: '/404.html', status: 404 });
}
config.routes = routes;
writeFileSync(CONFIG, JSON.stringify(config, null, '\t'));
console.log('vercel-404: unknown URLs now get the custom 404 page.');
