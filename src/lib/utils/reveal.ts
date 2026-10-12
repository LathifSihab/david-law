import type { Attachment } from 'svelte/attachments';

/**
 * Scroll reveal: the element (or, with `stagger`, each of its children in turn) fades up the
 * first time it scrolls into view. Content stays visible without JS, when the user prefers
 * reduced motion, and when it is already on screen at hydration, so nothing ever blinks out.
 * The hidden and shown states are CSS in app.css (`[data-reveal]`).
 */
export function reveal({ stagger = false } = {}): Attachment<HTMLElement> {
	return (node) => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (node.getBoundingClientRect().top < innerHeight) return;

		if (stagger) {
			Array.from(node.children).forEach((child, i) => {
				(child as HTMLElement).style.setProperty('--reveal-index', String(i));
			});
		}
		node.dataset.reveal = stagger ? 'stagger' : 'self';
		node.dataset.revealHidden = '';

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				delete node.dataset.revealHidden;
				observer.disconnect();
			},
			{ rootMargin: '0px 0px -12% 0px' }
		);
		observer.observe(node);
		return () => observer.disconnect();
	};
}
