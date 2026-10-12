/**
 * Post-build step for Vercel. adapter-static's zero-config output (.vercel/output) is complete
 * except for two things this script adds to its config.json:
 *
 * 1. Security headers on every response, including the ones a <meta> CSP can't carry
 *    (frame-ancestors against clickjacking). The main CSP comes from SvelteKit (vite.config.ts).
 * 2. The custom 404 page for unknown URLs (otherwise Vercel answers with its own plain-text 404).
 *
 * Locally there is no .vercel/output, so it does nothing.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const CONFIG = '.vercel/output/config.json';
const PAGE = '.vercel/output/static/404.html';

if (!existsSync(CONFIG)) process.exit(0);
if (!existsSync(PAGE)) {
	console.error(`vercel-output: ${PAGE} is missing, so the custom 404 page can't be served.`);
	process.exit(1);
}

interface Route {
	handle?: string;
	[key: string]: unknown;
}

const SECURITY_HEADERS = {
	'Content-Security-Policy': "frame-ancestors 'none'",
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains'
};

const config = JSON.parse(readFileSync(CONFIG, 'utf8')) as {
	routes?: Route[];
	overrides?: Record<string, unknown>;
};
let routes = config.routes ?? [];

// 1. Headers first, with continue: true, so every later route still applies.
routes = routes.filter((route) => route.src !== '/(.*)' || !route.continue);
routes.unshift({ src: '/(.*)', headers: SECURITY_HEADERS, continue: true });

// 2. The adapter serves 404.html at the clean path /404 via an override. Error-phase destinations
// resolve against real file paths, so keep the file at /404.html and point the error route there.
if (config.overrides) delete config.overrides['404.html'];
if (!routes.some((route) => route.handle === 'error')) {
	routes.push({ handle: 'error' }, { src: '/.*', dest: '/404.html', status: 404 });
}

config.routes = routes;
writeFileSync(CONFIG, JSON.stringify(config, null, '\t'));
console.log('vercel-output: security headers and custom 404 configured.');
